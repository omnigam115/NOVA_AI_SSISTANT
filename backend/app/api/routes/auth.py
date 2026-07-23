"""
Authentication API endpoints.

Handles user registration, login token generation, and profile retrieval.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import Token, UserCreate, UserLogin, UserResponse
from app.services.security import create_access_token, hash_password, verify_password
from app.utils.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Create a new user profile after validating uniqueness and password criteria.

    Args:
        user_in: User registration details.
        db: Request-scoped database session.

    Returns:
        User: Created user ORM model instance.
    """
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        logger.warning("Registration failed: Email '%s' is already registered.", user_in.email)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email address already exists.",
        )

    hashed_pw = hash_password(user_in.password)
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hashed_pw,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    logger.info("Successfully registered user: %s (ID: %s)", new_user.email, new_user.user_id)
    return new_user


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user and obtain access token",
)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> Token:
    """
    Authenticate user credentials and issue a signed JWT access token.

    Args:
        credentials: Login credentials containing email and raw password.
        db: Request-scoped database session.

    Returns:
        Token: Bearer access token object.
    """
    logger.info("Attempting login for email: %s", credentials.email)

    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.hashed_password):
        logger.warning("Authentication failed for email: %s", credentials.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=str(user.user_id))
    logger.info("User successfully authenticated: %s (ID: %s)", user.email, user.user_id)

    return Token(access_token=access_token, token_type="bearer")


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Fetch details for the currently authenticated user session.

    Args:
        current_user: Injected User model from validated JWT token.

    Returns:
        User: Authenticated user model instance.
    """
    return current_user
