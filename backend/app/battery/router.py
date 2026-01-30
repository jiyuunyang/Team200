# backend/app/battery/router.py

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.models import Battery, BatteryCycle, User
from app.auth.dependencies import get_current_user
from app.battery.schemas import (
    BatteryCreateRequest,
    BatteryResponse,
    BatteryCycleCreate,
    BatteryCycleResponse,
)

router = APIRouter(prefix="/batteries", tags=["Battery"])

# 배터리 생성
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


# 배터리 목록 조회 (기존 그대로 OK)
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


# 배터리 cycle + feature(JSON) 추가 (핵심 추가)
@router.post(
    "/{battery_id}/cycles",
    response_model=BatteryCycleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_battery_cycle(
    battery_id: int,
    data: BatteryCycleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 1️⃣ 배터리 소유권 확인
    battery = (
        db.query(Battery)
        .filter(
            Battery.id == battery_id,
            Battery.user_id == current_user.id,
        )
        .first()
    )

    if not battery:
        raise HTTPException(status_code=404, detail="Battery not found")

    # 2️⃣ cycle 생성
    cycle = BatteryCycle(
        battery_id=battery.id,
        cycle_index=data.cycle_index,
        features=data.features,
    )

    db.add(cycle)

    # 3️⃣ 첫 데이터면 has_data true
    if not battery.has_data:
        battery.has_data = True

    db.commit()
    db.refresh(cycle)

    return cycle


# 배터리별 cycle 조회 API
@router.get(
    "/{battery_id}/cycles",
    response_model=List[BatteryCycleResponse],
)
def list_battery_cycles(
    battery_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    battery = (
        db.query(Battery)
        .filter(
            Battery.id == battery_id,
            Battery.user_id == current_user.id,
        )
        .first()
    )

    if not battery:
        raise HTTPException(status_code=404, detail="Battery not found")

    return (
        db.query(BatteryCycle)
        .filter(BatteryCycle.battery_id == battery_id)
        .order_by(BatteryCycle.cycle_index)
        .all()
    )
