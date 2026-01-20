from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class EchoIn(BaseModel):
    message: str

@router.get("/health")
def health():
    return {"ok": True, "time": datetime.utcnow().isoformat() + "Z"}

@router.get("/hello")
def hello(name: str = "world"):
    return {"msg": f"hello, {name}"}

@router.post("/echo")
def echo(payload: EchoIn):
    return {"you_sent": payload.message}
