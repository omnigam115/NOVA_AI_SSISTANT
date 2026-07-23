"""
Centralized application configuration.

All runtime configuration is sourced from environment variables (or a
local `.env` file during development) via `pydantic-settings`. No secret
values are ever hardcoded here — see `.env.example` at the backend root
for the full list of variables an operator must supply.

Usage:
    from app.config.settings import get_settings
    settings = get_settings()
"""

from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Typed representation of all environment-driven configuration.

    Attributes:
        APP_NAME: Human-readable service name, used in logs and docs.
        APP_ENV: Deployment environment (development | staging | production).
        DEBUG: Enables verbose error output and API docs when True.
        API_V1_PREFIX: URL prefix applied to all versioned API routes.

        DATABASE_URL: Async SQLAlchemy connection string (asyncpg driver).
        DATABASE_URL_SYNC: Sync connection string, used only by Alembic.

        JWT_SECRET_KEY: Symmetric signing key for JWT access tokens.
        JWT_ALGORITHM: Signing algorithm (e.g. HS256).
        JWT_ACCESS_TOKEN_EXPIRE_MINUTES: Access token lifetime in minutes.

        CORS_ALLOWED_ORIGINS: Comma-separated list of allowed frontend origins.

        LOG_LEVEL: Root logging level (DEBUG | INFO | WARNING | ERROR).
    """

    model_config = SettingsConfigDict(
        env_file=[
            Path(__file__).resolve().parents[1] / ".env",
            Path(__file__).resolve().parents[2] / ".env",
        ],
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # --- General ---
    APP_NAME: str = "NOVA AI Assistant"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # --- Database ---
    DATABASE_URL: str = "sqlite+aiosqlite:///./nova.db"
    DATABASE_URL_SYNC: str = "sqlite:///./nova.db"

    # --- Authentication / JWT ---
    JWT_SECRET_KEY: str = "CHANGE_ME_IN_ENV"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # --- CORS ---
    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    # --- Logging ---
    LOG_LEVEL: str = "INFO"

    @property
    def cors_origins_list(self) -> List[str]:
        """Return CORS_ALLOWED_ORIGINS as a clean list of origin strings."""
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """
    Return a cached `Settings` instance.

    Using `lru_cache` ensures the environment is parsed only once per
    process, and the same immutable settings object is shared across
    the application (a lightweight singleton pattern).
    """
    return Settings()
