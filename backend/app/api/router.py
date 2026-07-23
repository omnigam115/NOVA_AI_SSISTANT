"""
Central API router.

Aggregates all route modules under `app/api/routes/` into a single
router that `main.py` mounts under the configured API prefix. Adding a
new feature's routes should never require touching `main.py` — only
this file.
"""

from fastapi import APIRouter

from app.api.routes import auth, health

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
