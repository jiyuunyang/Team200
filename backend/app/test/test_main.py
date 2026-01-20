import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from test.test_front import router as front_router
from test.test_ml import router as ml_router

load_dotenv()

app = FastAPI(title="Integration Test Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# front 관련 요청
app.include_router(
    front_router,
    prefix="",
    tags=["front-test"]
)

# ml 관련 요청
app.include_router(
    ml_router,
    prefix="/ml",
    tags=["ml-test"]
)

@app.get("/")
def root():
    return {
        "app": os.getenv("APP_NAME"),
        "env": os.getenv("APP_ENV"),
    }