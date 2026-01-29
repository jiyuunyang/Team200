from fastapi import FastAPI

from app.auth.router import router as auth_router
from app.db.base import Base
from app.db.session import engine
from app.battery.router import router as battery_router

app = FastAPI()

# 🔴 DB 테이블 생성 (필수)
Base.metadata.create_all(bind=engine)

# Health Check
@app.get("/")
def health_check():
    return {"status": "ok"}

# Auth routes
app.include_router(auth_router, prefix="/auth")
app.include_router(battery_router)