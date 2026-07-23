"""
NOVA AI Assistant — Backend Application Server entrypoint.

This module is intentionally minimal: it wires together configuration,
logging, middleware, and routers. Business and domain logic must never
live here — it belongs in the appropriate layer (api/routes, services,
brain, planner, agent_manager, agents, tools).

Run locally with:
    uvicorn main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config.settings import get_settings
from app.utils.logger import configure_logging, get_logger

settings = get_settings()
configure_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle hooks."""
    logger.info("Starting %s in '%s' environment", settings.APP_NAME, settings.APP_ENV)
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)
if settings.API_V1_PREFIX != "/api":
    app.include_router(api_router, prefix="/api")
