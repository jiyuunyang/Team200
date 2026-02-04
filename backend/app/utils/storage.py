from pathlib import Path
from datetime import datetime, timezone
import re

DATA_ROOT = Path("./data")
ALLOWED_EXT = {".csv", ".xlsx", ".txt"}

def _safe_dirname(name: str) -> str:
    """
    폴더명 안전화 (경로 탈출/특수문자 방지)
    - 실제 DB에는 원본 vehicle_name 저장
    - 파일시스템에는 안전한 폴더명 사용
    """
    name = (name or "").strip()
    name = re.sub(r"[\\/]+", "_", name)         # 슬래시 방지
    name = re.sub(r"[^0-9A-Za-z가-힣 _.-]", "_", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name[:80] if name else "unknown"

def ensure_battery_dir(user_id: int, battery_name: str) -> Path:
    user_dir = DATA_ROOT / f"user_{user_id}"
    user_dir.mkdir(parents=True, exist_ok=True)

    safe_battery = _safe_dirname(battery_name)
    base = user_dir / safe_battery
    base.mkdir(parents=True, exist_ok=True)
    return base

def build_filename(original_filename: str) -> tuple[str, str]:
    ext = Path(original_filename).suffix.lower()
    if ext not in ALLOWED_EXT:
        raise ValueError(f"unsupported extension: {ext}")

    # 이나: 윈도우에서 ':' 문자가 파일명에 허용되지 않음 -> 수정 (260204)
    # strftime("%Y-%m-%d_%H:%M:%S") ->  "%Y-%m-%d_%H-%M-%S"
    ts = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d_%H-%M-%S")
    return f"{ts}{ext}", ext
