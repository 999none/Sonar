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

## Remaining Phases
- Phase 2: Projects persistent in MongoDB
- Phase 3: Real AI generation via LLM
- Phase 4: Agent system configuration
- Phase 5: Deploy & Share
- Phase 6: Preview iframe sandbox
