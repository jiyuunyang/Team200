from typing import List
from pathlib import Path
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.models import (
    Battery,
    BatteryCycle,
    BatteryFileUpload,
    BatteryRUL,
    User,
)
from app.auth.dependencies import get_current_user
from app.battery.schemas import (
    BatteryCreateRequest,
    BatteryResponse,
    BatteryCycleCreate,
    BatteryCycleResponse,
    BatteryFileUploadResponse,
)
from app.utils.storage import ensure_battery_dir, build_filename
from app.utils.ml_client import predict_rul
from app.battery.service import calc_rul_status

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
        .filter(Battery.id == battery_id, Battery.user_id == current_user.id)
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
        .filter(Battery.id == battery_id, Battery.user_id == current_user.id)
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


# ======================================
# Internal utility (get or create battery)
# ======================================
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
# File Upload
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

    # CSV 확장자 검사
    if not battery_file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # Battery 확보(없으면 생성)
    battery = get_or_create_battery(db, current_user.id, battery_name)

    # 저장 경로 생성
    raw_dir = ensure_battery_dir(current_user.id, battery_name)
    filename, ext = build_filename(battery_file.filename)
    save_path = raw_dir / filename

    # 파일 저장
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

    # DB에 기록
    upload = BatteryFileUpload(
        battery_id=battery.id,
        user_id=current_user.id,
        original_filename=battery_file.filename,
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
# RUL Prediction
# ====================
@router.post("/{battery_id}/rul")
def predict_battery_rul(
    battery_id: int,
    csv_path: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    battery = (
        db.query(Battery)
        .filter(Battery.id == battery_id, Battery.user_id == current_user.id)
        .first()
    )
    if not battery:
        raise HTTPException(status_code=404, detail="Battery not found")

    # 실제 backendWorkspace 경로인지 확인
    if not csv_path.startswith("/backendWorkspace/data"):
        raise HTTPException(status_code=400, detail="Invalid csv_path")

    ml_csv_path = csv_path.replace(
        "/backendWorkspace/data",
        "/mlWorkspace/data",
        1,
    )

    # ML 결과
    ml_result = predict_rul(ml_csv_path)
    if "rul" not in ml_result:
        raise HTTPException(status_code=500, detail="Invalid ML response")

    rul = float(ml_result["rul"])
    rul_status = calc_rul_status(rul)

    # DB 저장
    battery_rul = BatteryRUL(
        battery_id=battery.id,
        battery_file_upload_id=ml_result.get("battery_file_upload_id"),
        rul=rul,
        rul_status=rul_status,
        model=ml_result.get("model"),
        model_version=ml_result.get("model_version"),
        sequence_length=ml_result.get("sequence_length"),
        feature_count=ml_result.get("feature_count"),
        latency_ms=ml_result.get("latency_ms"),
        inference_time=ml_result.get("inference_time"),
        raw_response=ml_result,
    )
    db.add(battery_rul)
    db.commit()
    db.refresh(battery_rul)

    return {
        "battery_id": battery.id,
        "battery_rul_id": battery_rul.id,
        **ml_result,
        "rul_status": rul_status,
        "created_at": battery_rul.created_at,
    }


# ====================
# Upload List
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
        .filter(Battery.id == battery_id, Battery.user_id == current_user.id)
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
# File Download
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
        media_type="text/csv",
    )
