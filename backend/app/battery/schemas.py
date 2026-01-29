from pydantic import BaseModel


class BatteryCreateRequest(BaseModel):
    battery_name: str


class BatteryResponse(BaseModel):
    id: int
    battery_name: str
    has_data: bool

    class Config:
        orm_mode = True
