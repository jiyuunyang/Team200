# backend/app/battery/schemas.py

from pydantic import BaseModel, Field
from typing import Dict
from datetime import datetime


# --------------------
# Battery
# --------------------
class BatteryCreateRequest(BaseModel):
    battery_name: str


class BatteryResponse(BaseModel):
    id: int
    battery_name: str
    has_data: bool

    class Config:
        orm_mode = True


# --------------------
# Battery Cycle
# --------------------
class BatteryCycleCreate(BaseModel):
    cycle_index: int
    features: Dict[str, float]


class BatteryCycleResponse(BaseModel):
    id: int
    battery_id: int
    cycle_index: int
    features: Dict[str, float]
    created_at: datetime

    class Config:
        from_attributes = True


# --------------------
# Battery RUL (Response)
# --------------------
class RULCheckResponse(BaseModel):
    battery_id: int
    rul: float = Field(..., ge=0.0, le=1.0)
    rul_status: int


# --------------------
# Battery File Upload
# --------------------
class BatteryFileUploadResponse(BaseModel):
    id: int
    battery_id: int
    user_id: int
    original_filename: str
    file_ext: str
    file_size: int
    uploaded_at: datetime

    class Config:
        from_attributes = True
