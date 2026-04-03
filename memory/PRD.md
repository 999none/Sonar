# Sonar — AI App Builder

## Overview
Sonar is an AI app builder (clone d'Emergent) that lets users create apps without coding.

## Stack
- Frontend: React 18, TailwindCSS, Framer Motion, Lucide Icons, Radix UI, Axios
- Backend: FastAPI (Python), MongoDB (Motor async)
- Auth: JWT (PyJWT), bcrypt password hashing

## Completed Phases

### Phase 1 — Authentication (DONE)
- **Backend**: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- **Frontend**: AuthContext.jsx (global auth state), AuthPage.jsx (real API calls), JWT session persistence
- User model: { id UUID, name, email, password_hash, created_at, avatar_url }
- JWT expires after 72 hours, stored in localStorage as "sonar-token"
- Axios used for API calls (to bypass visual-edits fetch interceptor)
- Error handling works correctly: 409 "Email already registered", 401 "Invalid email or password"

### Phase 2 — Projects Persistent MongoDB (DONE)
- **Backend**: Full CRUD API with ownership checks
  - POST /api/projects — Create project (auth required)
  - GET /api/projects — List user's projects sorted by updated_at desc
  - GET /api/projects/{id} — Get single project with ownership check
  - PATCH /api/projects/{id} — Update project (name, status, code, messages, prompt)
  - DELETE /api/projects/{id} — Delete project with ownership check
  - Cross-user isolation: users can only access their own projects
- **Frontend**: 
  - `/api/projects.js` helper with axios instance + auth token management
  - App.js fetches projects from API when authenticated, shows demo tasks when not
  - AppBuilder creates/updates/deletes projects via API
  - Projects persist across sessions and page refreshes
- Project model: { id UUID, user_id, name, prompt, type, status, code, messages[], model, mode, created_at, updated_at }
- Note: Generation flow is still MOCKED (uses mock code templates from mockData.js)

## Remaining Phases
- Phase 3: Real AI generation via LLM (replace mock code with actual LLM-generated code)
- Phase 4: Agent system configuration
- Phase 5: Deploy & Share
- Phase 6: Preview iframe sandbox

## Key Files
```
/app/backend/server.py              ← FastAPI server (auth + projects CRUD)
/app/frontend/src/App.js            ← routing + AuthProvider + project loading
/app/frontend/src/api/projects.js   ← API helper for project CRUD
/app/frontend/src/contexts/AuthContext.jsx  ← auth state management
/app/frontend/src/components/       ← all UI components
/app/frontend/src/data/mockData.js  ← mock code templates (to be replaced by LLM in Phase 3)
```
