"use client"

import { EquipmentCard } from "./equipment-card"
import { Button } from "@/components/ui/button"

interface EquipmentGridProps {
  filter: string
  onFilterChange: (filter: string) => void
}

const filters = [
  { id: "all", label: "전체" },
  { id: "normal", label: "정상" },
  { id: "warning", label: "주의" },
  { id: "critical", label: "위험" },
]

const equipmentData = [
  {
    id: "EQ-001",
    name: "CNC 밀링 머신 #1",
    type: "가공 장비",
    image: "/industrial-machine.png",
    healthScore: 94,
    status: "normal" as const,
    lastMaintenance: "2025-12-15",
    nextMaintenance: "2026-03-15",
    faultProbability: 6,
    temperature: 42,
    vibration: 2.1,
  },
  {
    id: "EQ-002",
    name: "유압 프레스 #3",
    type: "프레스 장비",
    image: "/hydraulic-press-machine-industrial.jpg",
    healthScore: 67,
    status: "warning" as const,
    lastMaintenance: "2025-10-20",
    nextMaintenance: "2026-01-20",
    faultProbability: 33,
    temperature: 58,
    vibration: 4.8,
  },
  {
    id: "EQ-003",
    name: "컨베이어 벨트 A",
    type: "이송 장비",
    image: "/conveyor-belt.png",
    healthScore: 23,
    status: "critical" as const,
    lastMaintenance: "2025-08-10",
    nextMaintenance: "즉시 교체 필요",
    faultProbability: 77,
    temperature: 65,
    vibration: 8.2,
  },
  {
    id: "EQ-004",
    name: "로봇팔 #2",
    type: "자동화 장비",
    image: "/industrial-robot-arm-manufacturing-automation.jpg",
    healthScore: 88,
    status: "normal" as const,
    lastMaintenance: "2025-11-05",
    nextMaintenance: "2026-02-05",
    faultProbability: 12,
    temperature: 38,
    vibration: 1.5,
  },
  {
    id: "EQ-005",
    name: "용접기 #5",
    type: "용접 장비",
    image: "/industrial-welding-machine-equipment.jpg",
    healthScore: 71,
    status: "warning" as const,
    lastMaintenance: "2025-09-28",
    nextMaintenance: "2026-01-28",
    faultProbability: 29,
    temperature: 52,
    vibration: 3.9,
  },
  {
    id: "EQ-006",
    name: "레이저 커터 #1",
    type: "절단 장비",
    image: "/industrial-laser-cutter-machine.jpg",
    healthScore: 45,
    status: "critical" as const,
    lastMaintenance: "2025-07-15",
    nextMaintenance: "즉시 점검 필요",
    faultProbability: 55,
    temperature: 72,
    vibration: 6.5,
  },
]

export function EquipmentGrid({ filter, onFilterChange }: EquipmentGridProps) {
  const filteredEquipment = filter === "all" ? equipmentData : equipmentData.filter((eq) => eq.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">장비 현황</h2>
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.id}
              variant={filter === f.id ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(f.id)}
              className={
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEquipment.map((equipment) => (
          <EquipmentCard key={equipment.id} equipment={equipment} />
        ))}
      </div>
    </div>
  )
}
