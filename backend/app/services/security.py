"""
Security service: password hashing and JWT token utilities.

This module provides the reusable building blocks for authentication.
It intentionally does NOT expose any API routes or business logic
(e.g. register/login flows) — that belongs to a later phase. Phase 1
only establishes the structural pattern so JWT is configured and ready.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Optional

import bcrypt
from jose import JWTError, jwt

from app.config.settings import get_settings
from app.utils.logger import get_logger

settings = get_settings()
logger = get_logger(__name__)


def hash_password(plain_password: str) -> str:
    """
    Hash a plaintext password using bcrypt.

    Args:
        plain_password: The raw password supplied by the user.

    Returns:
        The bcrypt hash, safe to persist.
    """
    pwd_bytes = plain_password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against its stored bcrypt hash.

    Args:
        plain_password: The raw password supplied at login time.
        hashed_password: The previously stored bcrypt hash.

    Returns:
        True if the password matches, False otherwise.
    """
    pwd_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)


def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a signed JWT access token.

    Args:
        subject: The token subject, typically the user's UUID as a string.
        expires_delta: Optional custom expiry window; defaults to the
            configured `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`.

    Returns:
        An encoded JWT string.
    """
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode: dict[str, Any] = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decode and validate a JWT access token.

    Args:
        token: The encoded JWT string.

    Returns:
        The decoded payload if valid, otherwise None.
    """
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        logger.warning("Failed to decode JWT: %s", exc)
        return None
