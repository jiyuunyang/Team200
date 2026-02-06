from fastapi import APIRouter
from app.utils.ml_client import ml_health, ml_classify

router = APIRouter()

@router.get("/health")
def ml_health_check():
    return ml_health()

@router.post("/predict")
def ml_predict(payload: dict):
    return ml_classify(payload)
