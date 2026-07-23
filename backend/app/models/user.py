"""
User ORM model.

Mirrors the `users` table defined in the project's Database Schema
Reference (Section 6 of the specification), with one addition:
`hashed_password`, which is required to support JWT-based authentication
but was not explicitly listed in the reference schema. This is a
deliberate, minimal extension — no other columns have been added.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class User(Base):
    """
    Represents a registered NOVA AI Assistant user.

    Attributes:
        user_id: Primary key, UUID.
        name: Display name of the user.
        email: Unique login identifier.
        hashed_password: Bcrypt-hashed password (never store plaintext).
        created_at: UTC timestamp of account creation.
    """

    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
