# backend/app/utils/ml_client.py
import os
import requests

ML_BASE_URL = os.getenv("ML_BASE_URL", "http://ml:9000")

def predict_rul(payload: dict) -> dict:
    res = requests.post(
        f"{ML_BASE_URL}/predict",
        json=payload,
        timeout=30,
    )
    res.raise_for_status()
    return res.json()
