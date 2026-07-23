# NOVA AI Assistant — Architecture Reference

This document tracks how the codebase maps to the layered architecture
defined in the project's Comprehensive Project Architecture & Technical
Specification.

Frontend → Backend → AI Brain → Planner → Agent Manager → Specialized Agents → Tools → Memory → Database

## Phase 1 status (Project Foundation)

| Layer | Status | Location |
|---|---|---|
| Frontend | Scaffolded (React + Vite + Tailwind + Router + Axios) | `frontend/` |
| Backend (API server) | Scaffolded (FastAPI, CORS, health check) | `backend/app/api/` |
| AI Brain | Placeholder only | `backend/app/brain/` |
| Planner | Placeholder only | `backend/app/planner/` |
| Agent Manager | Placeholder only | `backend/app/agent_manager/` |
| Specialized Agents | Placeholder only | `backend/app/agents/` |
| Tools | Placeholder only | `backend/app/tools/` |
| Memory | Placeholder only | `backend/app/memory/` |
| Database | Configured (SQLAlchemy async engine + Alembic) | `backend/app/database/`, `backend/alembic/` |

Placeholder layers contain only a documented `__init__.py` describing
their future responsibility. No business logic has been implemented in
these layers yet — they will be built out in later phases, one at a
time, with explicit approval before proceeding to the next phase.

## Rule: never bypass a layer

Even in later phases, requests must always flow through the full chain
(e.g. the API layer must never call an Agent directly — it must go
through the Brain → Planner → Agent Manager sequence). This is enforced
structurally by only importing "the next layer down" from any given
layer.
