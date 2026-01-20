# services/ml_client.py
import os
import requests

ML_BASE_URL = os.getenv("ML_BASE_URL", "http://localhost:9000")

def ml_health():
    res = requests.get(f"{ML_BASE_URL}/health", timeout=5)
    res.raise_for_status()
    return res.json()

def ml_classify(payload: dict):
    res = requests.post(
        f"{ML_BASE_URL}/predict",
        json=payload,
        timeout=10
    )
    res.raise_for_status()
    return res.json()
