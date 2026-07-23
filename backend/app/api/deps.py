"""
FastAPI dependency functions.

Provides reusable dependencies for route handlers, including database session
injection and authenticated user retrieval via JWT tokens.
"""

from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import get_settings
from app.database.session import get_db
from app.models.user import User
from app.services.security import decode_access_token
from app.utils.logger import get_logger

settings = get_settings()
logger = get_logger(__name__)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login"
)


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Validate incoming JWT access token and return the authenticated User.

    Args:
        token: Bearer JWT token extracted from Authorization header.
        db: Request-scoped database session.

    Returns:
        User: The active authenticated User ORM model instance.

    Raises:
        HTTPException 401: If token decoding fails or user does not exist.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    user_id_str: str = payload.get("sub")
    if not user_id_str:
        raise credentials_exception

    try:
        user_uuid = UUID(user_id_str)
    except ValueError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.user_id == user_uuid))
    user = result.scalar_one_or_none()

    if user is None:
        logger.warning("Token payload referenced non-existent user_id: %s", user_id_str)
        raise credentials_exception

    return user
