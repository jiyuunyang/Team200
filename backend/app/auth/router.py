# backend/app/auth/router.py
from fastapi import APIRouter, HTTPException, status, Depends

from app.auth.schemas import LoginRequest, LoginResponse
from app.auth.service import login_user
from app.auth.dependencies import get_current_user

router = APIRouter(tags=["Auth"])


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    result = login_user(data)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return result


@router.get("/me")
def read_me(current_user: dict = Depends(get_current_user)):
    return {
        "user_id": current_user.get("user_id"),
        "email": current_user.get("email"),
    }
