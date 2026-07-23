# NOVA AI Assistant

Production-grade, multi-agent AI Operating System. This repository is
being built phase by phase, strictly following the project's Software
Architecture & Technical Specification. See `docs/ARCHITECTURE.md` for
the current build status of every architectural layer.

**Current phase: Phase 1 — Project Foundation.** No AI Brain, Planner,
Agent Manager, agents, or model integrations exist yet. Only the base
project skeleton, database, auth structure, and health check are wired
up.

## Project Structure

```
NOVA-AI-ASSISTANT/
├── backend/
│   ├── app/
│   │   ├── api/            # REST endpoint declarations (routes/)
│   │   ├── brain/          # [Phase 3] AI Brain orchestrator
│   │   ├── planner/        # [Phase 3] Dependency-aware task planner
│   │   ├── agent_manager/  # [Phase 3] Worker lifecycle & dispatch
│   │   ├── agents/         # [Phase 4] Specialized AI workers
│   │   ├── tools/          # [Phase 4] Secure infrastructure tool wrappers
│   │   ├── memory/         # [Phase 5] Session + vector memory
│   │   ├── database/       # SQLAlchemy engine, session, declarative base
│   │   ├── models/         # ORM models (User, ...)
│   │   ├── services/       # Reusable business services (security/JWT, ...)
│   │   ├── config/         # Environment-driven settings
│   │   └── utils/          # Shared helpers (logging, ...)
│   ├── alembic/            # Database migrations
│   ├── main.py             # FastAPI app entrypoint
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── router/         # React Router configuration
│   │   ├── services/       # Axios API client
│   │   └── styles/         # Tailwind entry stylesheet
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env.example
├── docs/
│   └── ARCHITECTURE.md
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Python 3.12+
- Node.js 20+
- PostgreSQL 16 (or use the provided Docker service)
- Docker & Docker Compose (recommended)

## Running with Docker (recommended)

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# edit backend/.env and set a real JWT_SECRET_KEY

docker compose up --build
```

- Backend: http://localhost:8000/api/status
- Frontend: http://localhost:5173

## Running locally without Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then edit DATABASE_URL to point at your local Postgres
alembic upgrade head    # once a migration exists
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Database Migrations (Alembic)

```bash
cd backend
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full,
documented list. No secrets are ever committed — `.env` is gitignored.

## Roadmap

Phases follow the specification's Development Roadmap (Section 9):

1. **Project Foundation** ← you are here
2. UI Boilerplate + FastAPI Integration
3. Cognitive Engineering (AI Brain, Planner, Agent Manager)
4. Agent Specialization & Tool Integration
5. Memory Synchronization & JWT Security Enforcement
6. Testing, Performance Optimization, Production Deployment
