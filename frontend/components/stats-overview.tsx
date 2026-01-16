import { Activity, AlertTriangle, CheckCircle, Wrench } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    label: "전체 장비",
    value: "24",
    subtext: "모니터링 중",
    icon: Activity,
    iconColor: "text-primary",
  },
  {
    label: "정상 가동",
    value: "18",
    subtext: "75%",
    icon: CheckCircle,
    iconColor: "text-success",
  },
  {
    label: "주의 필요",
    value: "4",
    subtext: "16.7%",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  {
    label: "즉시 교체",
    value: "2",
    subtext: "8.3%",
    icon: Wrench,
    iconColor: "text-danger",
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.subtext}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
