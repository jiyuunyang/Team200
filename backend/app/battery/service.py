# backend/app/battery/service.py

THRESHOLDS = [
    (0.3, "warning", "배터리 수명 30% 이하"),
    (0.2, "danger", "배터리 수명 20% 이하"),
    (0.1, "critical", "배터리 수명 10% 이하"),
]


def check_rul_alerts(rul: float):
    alerts = []

    for threshold, level, message in THRESHOLDS:
        if rul <= threshold:
            alerts.append({
                "threshold": threshold,
                "level": level,
                "message": message
            })

    return alerts
