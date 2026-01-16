import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "컨베이어 벨트 A 즉시 교체 필요",
    description: "결함 예측률 77% - 베어링 마모 감지",
    time: "10분 전",
    icon: AlertCircle,
    iconColor: "text-danger",
    bgColor: "bg-danger/10",
  },
  {
    id: 2,
    type: "warning",
    title: "레이저 커터 #1 점검 권고",
    description: "비정상 온도 상승 감지 (72°C)",
    time: "25분 전",
    icon: AlertTriangle,
    iconColor: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 3,
    type: "warning",
    title: "유압 프레스 #3 유지보수 예정",
    description: "예정 정비일 D-6 / 진동 수치 상승",
    time: "1시간 전",
    icon: AlertTriangle,
    iconColor: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: 4,
    type: "info",
    title: "로봇팔 #2 정기 점검 완료",
    description: "모든 센서 정상 작동 확인",
    time: "3시간 전",
    icon: Info,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
]

export function AlertList() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          실시간 알림
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg ${alert.bgColor} border border-border`}>
            <div className="flex items-start gap-3">
              <alert.icon className={`w-5 h-5 ${alert.iconColor} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{alert.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
