"""
Declarative base for all ORM models.

Every model in `app/models/` must inherit from `Base` so that Alembic's
autogenerate feature can detect schema changes, and so all models share
a single `MetaData` registry.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Shared declarative base class for all SQLAlchemy ORM models."""
    pass
