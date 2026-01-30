# backend/app/battery/schemas.py

from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class BatteryCreateRequest(BaseModel):
    battery_name: str


class BatteryResponse(BaseModel):
    id: int
    battery_name: str
    has_data: bool

    class Config:
        orm_mode = True

class BatteryCycleCreate(BaseModel):
    cycle_index: int
    features: Dict[str, float]


class BatteryCycleResponse(BaseModel):
    id: int
    battery_id: int
    cycle_index: int
    features: dict
    created_at: datetime

    class Config:
        from_attributes = True