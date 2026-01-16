import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Thermometer, Activity, Calendar, AlertCircle } from "lucide-react"

interface Equipment {
  id: string
  name: string
  type: string
  image: string
  healthScore: number
  status: "normal" | "warning" | "critical"
  lastMaintenance: string
  nextMaintenance: string
  faultProbability: number
  temperature: number
  vibration: number
}

interface EquipmentCardProps {
  equipment: Equipment
}

const statusConfig = {
  normal: { label: "정상", color: "bg-emerald-500 text-white" },
  warning: { label: "주의", color: "bg-amber-500 text-white" },
  critical: { label: "위험", color: "bg-red-500 text-white" },
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const status = statusConfig[equipment.status]

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  const getProgressIndicatorColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <Card className="bg-card border-border hover:border-muted-foreground/30 transition-colors overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img src={equipment.image || "/placeholder.svg"} alt={equipment.name} className="w-full h-32 object-cover" />
          <Badge className={`absolute top-2 right-2 ${status.color}`}>{status.label}</Badge>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground">{equipment.name}</h3>
              <span className="text-xs text-muted-foreground">{equipment.id}</span>
            </div>
            <p className="text-sm text-muted-foreground">{equipment.type}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">장비 건강도</span>
              <span className={`font-bold ${getHealthColor(equipment.healthScore)}`}>{equipment.healthScore}%</span>
            </div>
            <Progress
              value={equipment.healthScore}
              className="h-2 bg-muted"
              indicatorClassName={getProgressIndicatorColor(equipment.healthScore)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>결함 예측률</span>
            </div>
            <span className={`font-semibold ${getHealthColor(100 - equipment.faultProbability)}`}>
              {equipment.faultProbability}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">온도</span>
              <span className="text-foreground ml-auto">{equipment.temperature}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">진동</span>
              <span className="text-foreground ml-auto">{equipment.vibration}mm/s</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm border-t border-border pt-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">다음 정비:</span>
            <span className={equipment.status === "critical" ? "text-red-500 font-medium" : "text-foreground"}>
              {equipment.nextMaintenance}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
