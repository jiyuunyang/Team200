# backend/app/auth/router.py

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.auth.schemas import (
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
    UserResponse
)
from app.auth.service import login_user, signup_user
from app.auth.dependencies import get_current_user
from app.db.dependencies import get_db
from app.db.models import User

router = APIRouter(tags=["Auth"])


# ===== Signup =====
@router.post("/signup", response_model=SignupResponse, status_code=201)
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db),
):
    user = signup_user(data, db)

    return {
        "message": "signup success",
        "user_id": user.id,
    }


# ===== Login =====
@router.post("/login", response_model=LoginResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    result = login_user(data, db)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return result


# ===== Me =====
@router.get("/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user
