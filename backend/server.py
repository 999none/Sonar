from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import re
from emergentintegrations.llm.chat import LlmChat, UserMessage
import asyncio
import json


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'sonar-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 72

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Model mapping for LLM providers
MODEL_MAP = {
    "gpt-4o": {"provider": "openai", "model": "gpt-4o"},
    "claude-sonnet": {"provider": "anthropic", "model": "claude-sonnet-4-20250514"},
    "gemini-pro": {"provider": "gemini", "model": "gemini-2.0-flash"},
}

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# System prompts for different modes
S1_GENERATE_PROMPT = """You are a stable, methodical React developer (S-1 mode).

Your approach:
1. Read and understand the full request before coding
2. Plan your implementation mentally first
3. Write clean, reliable code
4. Review what you wrote once before finishing
5. Fix any issues you spot
6. Return stable, working code

Priority: STABILITY over speed.
Verify your output is correct before returning it.

Generate a complete React component for the following request.
Use Tailwind CSS for styling. Return ONLY the raw JSX/React code.
Do NOT include markdown code fences. Do NOT include any explanation.
The code must be a single default export React component.
Include all necessary imports (useState, useEffect, etc.) at the top."""

S2_GENERATE_PROMPT = """You are a tenacious, deep-thinking React developer (S-2 mode).

Your approach:
1. Deeply analyze all requirements and edge cases
2. Think about what could go wrong before writing
3. Implement thoroughly — no shortcuts
4. Review your code critically
5. Fix every issue you find, even minor ones
6. Test edge cases mentally: empty states, errors, loading, mobile
7. Refine until you are genuinely satisfied
8. If something seems off, fix it — don't leave it

Priority: DEPTH + TENACITY.
Do not stop until the result is genuinely good.
Go beyond what was asked if it makes the app better.

Generate a complete, production-grade React component for the following request.
Use Tailwind CSS for styling. Return ONLY the raw JSX/React code.
Do NOT include markdown code fences. Do NOT include any explanation.
The code must be a single default export React component.
Include all necessary imports (useState, useEffect, etc.) at the top.
No shortcuts. No placeholder content. Make it production-ready."""

S1_CHAT_PROMPT = """You are modifying an existing React component (S-1 mode).
Current code:
{current_code}

Approach:
- Understand the current code before modifying
- Make the requested change cleanly
- Ensure nothing else breaks
- Return the complete modified code

Return ONLY the complete modified raw JSX/React code.
Do NOT include markdown code fences. Do NOT include any explanation."""

S2_CHAT_PROMPT = """You are improving an existing React component (S-2 mode).
Current code:
{current_code}

Approach:
- Deeply understand the architecture before touching it
- Apply the change + improve anything related
- Check for regressions
- If you notice other issues while working, fix them
- Return a better version of the full component

Return ONLY the complete modified raw JSX/React code.
Do NOT include markdown code fences. Do NOT include any explanation.
Make it genuinely better."""


# Define Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    avatar_url: str = ""

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar_url: str
    created_at: datetime

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ProjectCreate(BaseModel):
    name: str = "untitled-app"
    prompt: str
    type: str = "custom"  # todo, dashboard, ecommerce, custom
    model: str = "gpt-4o"
    mode: str = "S-1"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    code: Optional[str] = None
    messages: Optional[list] = None
    prompt: Optional[str] = None

class ProjectResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    name: str
    prompt: str
    type: str
    status: str
    code: str
    messages: list
    model: str
    mode: str
    created_at: str  # ISO string
    updated_at: str  # ISO string

class GenerateRequest(BaseModel):
    prompt: str
    model: str = "gpt-4o"
    mode: str = "S-1"  # "S-1" or "S-2"
    project_id: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    current_code: str = ""
    model: str = "gpt-4o"
    mode: str = "S-1"
    project_id: Optional[str] = None

# JWT Utility Functions
def create_token(user_id: str) -> str:
    """Create a JWT token for the given user ID."""
    expiration = datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {
        "user_id": user_id,
        "exp": expiration
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    """Verify a JWT token and return the payload."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password: str) -> bool:
    """Validate password (minimum 6 characters)."""
    return len(password) >= 6

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get the current authenticated user from JWT token."""
    token = credentials.credentials
    payload = verify_token(token)
    user_id = payload.get("user_id")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    # Find user in database
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Convert ISO string timestamp back to datetime object
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)

# Authentication Routes
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Validate input
    if not validate_email(user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    if not validate_password(user_data.password):
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
    
    # Check if email already exists
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Create new user
    user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hash_password(user_data.password)
    )
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    user_doc = user.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    # Insert into database
    await db.users.insert_one(user_doc)
    
    # Create JWT token
    token = create_token(user.id)
    
    # Return response
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        avatar_url=user.avatar_url,
        created_at=user.created_at
    )
    
    return AuthResponse(token=token, user=user_response)

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(login_data: UserLogin):
    """Login a user."""
    # Find user by email
    user_doc = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(login_data.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Convert ISO string timestamp back to datetime object
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**user_doc)
    
    # Create JWT token
    token = create_token(user.id)
    
    # Return response
    user_response = UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        avatar_url=user.avatar_url,
        created_at=user.created_at
    )
    
    return AuthResponse(token=token, user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return UserResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        avatar_url=current_user.avatar_url,
        created_at=current_user.created_at
    )

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Project CRUD Endpoints
@api_router.post("/projects", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, current_user: User = Depends(get_current_user)):
    """Create a new project."""
    # Generate UUID and timestamps
    project_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    
    # Create project document
    project_doc = {
        "id": project_id,
        "user_id": current_user.id,
        "name": project_data.name,
        "prompt": project_data.prompt,
        "type": project_data.type,
        "model": project_data.model,
        "mode": project_data.mode,
        "status": "created",
        "code": "",
        "messages": [],
        "created_at": now,
        "updated_at": now
    }
    
    # Insert into database
    await db.projects.insert_one(project_doc)
    
    # Return response
    return ProjectResponse(**project_doc)

@api_router.get("/projects", response_model=List[ProjectResponse])
async def get_user_projects(current_user: User = Depends(get_current_user)):
    """Get all projects for the current user."""
    # Find projects by user_id, sorted by updated_at descending
    projects = await db.projects.find(
        {"user_id": current_user.id}, 
        {"_id": 0}
    ).sort("updated_at", -1).to_list(1000)
    
    return [ProjectResponse(**project) for project in projects]

@api_router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, current_user: User = Depends(get_current_user)):
    """Get a single project by ID."""
    # Find by id AND user_id (ownership check)
    project_doc = await db.projects.find_one(
        {"id": project_id, "user_id": current_user.id}, 
        {"_id": 0}
    )
    
    if not project_doc:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(**project_doc)

@api_router.patch("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str, 
    project_update: ProjectUpdate, 
    current_user: User = Depends(get_current_user)
):
    """Update a project."""
    # Find by id AND user_id (ownership check)
    existing_project = await db.projects.find_one(
        {"id": project_id, "user_id": current_user.id}, 
        {"_id": 0}
    )
    
    if not existing_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Build update document with only non-None fields
    update_doc = {}
    if project_update.name is not None:
        update_doc["name"] = project_update.name
    if project_update.status is not None:
        update_doc["status"] = project_update.status
    if project_update.code is not None:
        update_doc["code"] = project_update.code
    if project_update.messages is not None:
        update_doc["messages"] = project_update.messages
    if project_update.prompt is not None:
        update_doc["prompt"] = project_update.prompt
    
    # Always update updated_at
    update_doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    # Update in database
    await db.projects.update_one(
        {"id": project_id, "user_id": current_user.id},
        {"$set": update_doc}
    )
    
    # Return updated project
    updated_project = await db.projects.find_one(
        {"id": project_id, "user_id": current_user.id}, 
        {"_id": 0}
    )
    
    return ProjectResponse(**updated_project)

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, current_user: User = Depends(get_current_user)):
    """Delete a project."""
    # Find and delete by id AND user_id (ownership check)
    result = await db.projects.delete_one(
        {"id": project_id, "user_id": current_user.id}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return {"deleted": True}

@api_router.post("/generate")
async def generate_code(request: GenerateRequest, req: Request):
    """Generate React component code using LLM."""
    # Try to get auth (optional)
    user = None
    auth_header = req.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            token = auth_header.split(" ")[1]
            payload = verify_token(token)
            user_id = payload.get("user_id")
            user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
            if user_doc:
                user = user_doc
        except:
            pass
    
    async def event_stream():
        try:
            # Get system prompt based on mode
            system_prompt = S1_GENERATE_PROMPT if request.mode == "S-1" else S2_GENERATE_PROMPT
            
            # Get model config
            model_config = MODEL_MAP.get(request.model, MODEL_MAP["gpt-4o"])
            
            # Get LLM key
            llm_key = os.environ.get("EMERGENT_LLM_KEY", "")
            
            # Create chat instance
            session_id = str(uuid.uuid4())
            chat = LlmChat(api_key=llm_key, session_id=session_id, system_message=system_prompt)
            chat = chat.with_model(model_config["provider"], model_config["model"])
            
            # Send message
            response = await chat.send_message(UserMessage(text=request.prompt))
            
            # Clean response - remove markdown code fences
            code = response.strip()
            if code.startswith("```"):
                lines = code.split("\n")
                # Remove first line (```jsx or similar)
                lines = lines[1:]
                # Remove last line if it's ```
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                code = "\n".join(lines)
            
            # Stream code in chunks
            chunk_size = 50
            for i in range(0, len(code), chunk_size):
                chunk = code[i:i+chunk_size]
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"
                await asyncio.sleep(0.02)  # Small delay for smooth streaming
            
            # Send final event with full code
            yield f"data: {json.dumps({'type': 'done', 'full_code': code})}\n\n"
            
            # Update project if authenticated
            if user and request.project_id:
                await db.projects.update_one(
                    {"id": request.project_id, "user_id": user["id"]},
                    {"$set": {
                        "code": code,
                        "status": "complete",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
        except Exception as e:
            logger.error(f"Generate error: {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

@api_router.post("/chat")
async def chat_with_code(request: ChatRequest, req: Request):
    """Chat with existing code to modify it using LLM."""
    # Try to get auth (optional)
    user = None
    auth_header = req.headers.get("authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            token = auth_header.split(" ")[1]
            payload = verify_token(token)
            user_id = payload.get("user_id")
            user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
            if user_doc:
                user = user_doc
        except:
            pass
    
    async def event_stream():
        try:
            # Get system prompt based on mode with current code injected
            if request.mode == "S-1":
                system_prompt = S1_CHAT_PROMPT.format(current_code=request.current_code)
            else:
                system_prompt = S2_CHAT_PROMPT.format(current_code=request.current_code)
            
            # Get model config
            model_config = MODEL_MAP.get(request.model, MODEL_MAP["gpt-4o"])
            
            # Get LLM key
            llm_key = os.environ.get("EMERGENT_LLM_KEY", "")
            
            # Create chat instance
            session_id = str(uuid.uuid4())
            chat = LlmChat(api_key=llm_key, session_id=session_id, system_message=system_prompt)
            chat = chat.with_model(model_config["provider"], model_config["model"])
            
            # Send message
            response = await chat.send_message(UserMessage(text=request.message))
            
            # Clean response - remove markdown code fences
            code = response.strip()
            if code.startswith("```"):
                lines = code.split("\n")
                # Remove first line (```jsx or similar)
                lines = lines[1:]
                # Remove last line if it's ```
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                code = "\n".join(lines)
            
            # Stream code in chunks
            chunk_size = 50
            for i in range(0, len(code), chunk_size):
                chunk = code[i:i+chunk_size]
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"
                await asyncio.sleep(0.02)  # Small delay for smooth streaming
            
            # Send final event with full code
            yield f"data: {json.dumps({'type': 'done', 'full_code': code})}\n\n"
            
            # Update project if authenticated
            if user and request.project_id:
                await db.projects.update_one(
                    {"id": request.project_id, "user_id": user["id"]},
                    {"$set": {
                        "code": code,
                        "status": "complete",
                        "updated_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
        except Exception as e:
            logger.error(f"Chat error: {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()