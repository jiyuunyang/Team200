# backend/app/battery/router.py

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.models import Battery, User
from app.auth.dependencies import get_current_user
from app.battery.schemas import BatteryCreateRequest, BatteryResponse

router = APIRouter(prefix="/batteries", tags=["Battery"])


@router.post("", response_model=BatteryResponse, status_code=201)
def create_battery(
    data: BatteryCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    battery = Battery(
        user_id=current_user.id,
        battery_name=data.battery_name,
        has_data=False,
    )

    db.add(battery)
    db.commit()
    db.refresh(battery)

    return battery


# ✅ 추가: 배터리 목록 조회
@router.get("", response_model=List[BatteryResponse])
def list_batteries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    batteries = (
        db.query(Battery)
        .filter(Battery.user_id == current_user.id)
        .order_by(Battery.created_at.desc())
        .all()
    )

    return batteries
