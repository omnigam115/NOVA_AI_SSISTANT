"""
Async database engine and session management.

The application uses SQLAlchemy's async engine (via the `asyncpg`
driver) for all runtime request handling, in line with the project rule
to use `async` wherever appropriate. Alembic migrations, by contrast,
run synchronously (see `alembic/env.py`) since most migration tooling
and third-party Alembic operations are simpler to run synchronously.
"""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config.settings import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields a request-scoped async DB session.

    The session is automatically closed once the request finishes,
    regardless of whether an exception was raised.

    Yields:
        AsyncSession: An active SQLAlchemy async session.
    """
    async with AsyncSessionLocal() as session:
        yield session
