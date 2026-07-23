"""
Health check endpoint.

Implements the `GET /api/status` route defined in Section 7.2 of the
project specification: "Returns real-time health metrics for individual
agents and services." In Phase 1, only the core API/database status is
reported; per-agent metrics will be added once agents exist.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import get_settings
from app.database.session import get_db
from app.utils.logger import get_logger

router = APIRouter(tags=["Health"])
logger = get_logger(__name__)
settings = get_settings()


@router.get("/status", status_code=status.HTTP_200_OK, summary="System health check")
async def get_status(db: AsyncSession = Depends(get_db)) -> dict:
    """
    Report the health of the API and its database connection.

    Args:
        db: Injected async database session.

    Returns:
        A dictionary describing service name, environment, timestamp,
        and the connectivity status of the database.
    """
    db_status = "ok"
    try:
        if settings.DATABASE_URL.startswith("sqlite"):
            await db.execute(text("SELECT 1"))
        else:
            await db.execute(text("SELECT 1"))
    except Exception as exc:  # noqa: BLE001 - deliberately broad for a health probe
        logger.error("Database health check failed: %s", exc)
        db_status = "unreachable"

    return {
        "service": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": db_status,
    }
