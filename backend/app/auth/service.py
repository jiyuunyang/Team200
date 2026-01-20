# backend/app/auth/service.py
from sqlalchemy.orm import Session

from app.auth.schemas import LoginRequest
from app.auth.jwt import create_access_token
from app.core.security import verify_password
from app.db.models import User


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
