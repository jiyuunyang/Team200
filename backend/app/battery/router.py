from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.models import Battery, BatteryCycle, BatteryRUL, User
from app.auth.dependencies import get_current_user
from app.battery.schemas import (
    BatteryCreateRequest,
    BatteryResponse,
    BatteryCycleCreate,
    BatteryCycleResponse,
    RULCreateRequest,
    RULCheckResponse,
)

router = APIRouter(prefix="/batteries", tags=["Battery"])


# ====================
# Battery
# ====================
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


@router.get("", response_model=List[BatteryResponse])
def list_batteries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Battery)
        .filter(Battery.user_id == current_user.id)
        .order_by(Battery.created_at.desc())
        .all()
    )


# ====================
# Battery Cycle
# ====================
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

    cycle = BatteryCycle(
        battery_id=battery.id,
        cycle_index=data.cycle_index,
        features=data.features,
    )

    db.add(cycle)

    if not battery.has_data:
        battery.has_data = True

    db.commit()
    db.refresh(cycle)

    return cycle


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


# ====================
# Battery RUL (일회성 상태)
# ====================
@router.post(
    "/{battery_id}/rul",
    response_model=RULCheckResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_battery_rul(
    battery_id: int,
    data: RULCreateRequest,
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

    # 1️⃣ rul_status 계산
    if data.rul <= 0.1:
        rul_status = 3
    elif data.rul <= 0.2:
        rul_status = 2
    elif data.rul <= 0.3:
        rul_status = 1
    else:
        rul_status = 0

    # 2️⃣ DB 저장
    rul_record = BatteryRUL(
        battery_id=battery.id,
        rul=data.rul,
        rul_status=rul_status,
    )
    db.add(rul_record)
    db.commit()

    # 3️⃣ 응답
    return {
        "battery_id": battery.id,
        "rul": data.rul,
        "rul_status": rul_status,
    }
