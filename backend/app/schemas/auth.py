"""
Authentication Pydantic schemas.

Provides data transfer objects for registration, login, token responses,
and user profile responses.
"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserCreate(BaseModel):
    """Payload for user registration."""

    name: str = Field(..., min_length=2, max_length=255, description="Full name of the user")
    email: EmailStr = Field(..., description="Unique user email address")
    password: str = Field(..., min_length=8, max_length=128, description="Raw password (min 8 chars)")

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        """Enforce password complexity rules."""
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one digit.")
        if not any(char.isalpha() for char in value):
            raise ValueError("Password must contain at least one letter.")
        return value


class UserLogin(BaseModel):
    """Payload for user authentication."""

    email: EmailStr = Field(..., description="User login email")
    password: str = Field(..., description="User password")


class UserResponse(BaseModel):
    """Public user profile response representation."""

    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    name: str
    email: EmailStr
    created_at: datetime


class Token(BaseModel):
    """JWT Token response structure."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Decoded JWT payload data container."""

    sub: Optional[str] = None
