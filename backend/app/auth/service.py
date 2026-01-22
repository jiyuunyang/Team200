# backend/app/auth/service.py

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.auth.schemas import LoginRequest, SignupRequest
from app.auth.jwt import create_access_token
from app.core.security import verify_password, hash_password
from app.db.models import User


# ===== Login =====
def login_user(data: LoginRequest, db: Session) -> dict | None:
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        return None

    if not verify_password(data.password, user.password_hash):
        return None

    access_token = create_access_token(
        data={
            "user_id": user.id,
            "email": user.email,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# ===== Signup =====
def signup_user(data: SignupRequest, db: Session) -> User:
    exists = db.query(User).filter(User.email == data.email).first()
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists",
        )

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        name=data.name,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user
