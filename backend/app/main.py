# backend/app/main.py
from fastapi import FastAPI

from app.auth.router import router as auth_router

app = FastAPI()

# Health Check
@app.get("/")
def health_check():
    return {"status": "ok"}

# Auth routes
app.include_router(auth_router, prefix="/auth")
