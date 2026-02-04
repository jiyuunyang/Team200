# backend/app/battery/router.py

from typing import List
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.models import (
    Battery,
    BatteryCycle,
    BatteryRUL,
    BatteryFileUpload,
    User,
)
from app.auth.dependencies import get_current_user
from app.battery.schemas import (
    BatteryCreateRequest,
    BatteryResponse,
    BatteryCycleCreate,
    BatteryCycleResponse,
    RULCreateRequest,
    RULCheckResponse,
    BatteryFileUploadResponse,
)
from app.utils.storage import ensure_battery_dir, build_filename

router = APIRouter(tags=["Battery"])


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

    if data.rul <= 0.1:
        rul_status = 3
    elif data.rul <= 0.2:
        rul_status = 2
    elif data.rul <= 0.3:
        rul_status = 1
    else:
        rul_status = 0

    rul_record = BatteryRUL(
        battery_id=battery.id,
        rul=data.rul,
        rul_status=rul_status,
    )
    db.add(rul_record)
    db.commit()

    return {
        "battery_id": battery.id,
        "rul": data.rul,
        "rul_status": rul_status,
    }


# ====================
# 내부 유틸: battery_name 기준 get-or-create
# ====================
def get_or_create_battery(
    db: Session,
    user_id: int,
    battery_name: str,
) -> Battery:
    battery = (
        db.query(Battery)
        .filter(
            Battery.user_id == user_id,
            Battery.battery_name == battery_name,
        )
        .first()
    )
    if battery:
        return battery

    battery = Battery(
        user_id=user_id,
        battery_name=battery_name,
        has_data=False,
    )
    db.add(battery)
    db.commit()
    db.refresh(battery)
    return battery


# ====================
# 파일 업로드
# POST /batteries/uploads
# ====================
@router.post(
    "/uploads",
    response_model=BatteryFileUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_battery_file(
    battery_name: str = Form(...),
    battery_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    battery_name = battery_name.strip()
    if not battery_name:
        raise HTTPException(status_code=400, detail="battery_name is required")

    # 1) Battery 확보
    battery = get_or_create_battery(db, current_user.id, battery_name)

    # 2) 파일 저장 경로 준비
    try:
        raw_dir = ensure_battery_dir(current_user.id, battery_name)
        filename, ext = build_filename(battery_file.filename or "upload.csv")
        save_path = raw_dir / filename
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # 3) 파일 저장
    total = 0
    try:
        with open(save_path, "wb") as f:
            while True:
                chunk = await battery_file.read(1024 * 1024)
                if not chunk:
                    break
                f.write(chunk)
                total += len(chunk)
    finally:
        await battery_file.close()

    # 4) 업로드 로그 저장
    upload = BatteryFileUpload(
        battery_id=battery.id,
        user_id=current_user.id,
        original_filename=battery_file.filename or "unknown",
        stored_path=str(save_path),
        file_ext=ext,
        file_size=total,
    )
    db.add(upload)

    if not battery.has_data:
        battery.has_data = True

    db.commit()
    db.refresh(upload)
    return upload


# ====================
# 업로드 목록 조회
# GET /batteries/{battery_id}/uploads
# ====================
@router.get(
    "/{battery_id}/uploads",
    response_model=List[BatteryFileUploadResponse],
)
def list_uploads(
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
        db.query(BatteryFileUpload)
        .filter(
            BatteryFileUpload.battery_id == battery_id,
            BatteryFileUpload.user_id == current_user.id,
        )
        .order_by(BatteryFileUpload.uploaded_at.desc())
        .all()
    )


# ====================
# 파일 다운로드
# GET /batteries/{battery_id}/uploads/{upload_id}/download
# ====================
@router.get("/{battery_id}/uploads/{upload_id}/download")
def download_upload(
    battery_id: int,
    upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    upload = (
        db.query(BatteryFileUpload)
        .join(Battery, Battery.id == BatteryFileUpload.battery_id)
        .filter(
            Battery.id == battery_id,
            Battery.user_id == current_user.id,
            BatteryFileUpload.id == upload_id,
            BatteryFileUpload.user_id == current_user.id,
        )
        .first()
    )
    if not upload:
        raise HTTPException(status_code=404, detail="File not found")

    path = Path(upload.stored_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="File missing on server")

    return FileResponse(
        path=str(path),
        filename=path.name,
        media_type="application/octet-stream",
    )
