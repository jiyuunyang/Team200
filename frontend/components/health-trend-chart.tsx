"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const data = [
  { date: "1월", health: 92, prediction: 88 },
  { date: "2월", health: 89, prediction: 85 },
  { date: "3월", health: 85, prediction: 82 },
  { date: "4월", health: 88, prediction: 84 },
  { date: "5월", health: 82, prediction: 78 },
  { date: "6월", health: 78, prediction: 75 },
  { date: "7월", health: 75, prediction: 72 },
]

export function HealthTrendChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          전체 건강도 추이
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={{ stroke: "#262626" }} />
              <YAxis tick={{ fill: "#a3a3a3", fontSize: 12 }} axisLine={{ stroke: "#262626" }} domain={[60, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
                labelStyle={{ color: "#a3a3a3" }}
              />
              <Line
                type="monotone"
                dataKey="health"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 0 }}
                name="실제 건강도"
              />
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#f59e0b", strokeWidth: 0 }}
                name="예측 건강도"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">실제 건강도</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">예측 건강도</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
