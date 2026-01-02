import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  change?: { value: number; direction: "up" | "down" }
  className?: string
}

export function StatCard({ label, value, icon, change, className = "" }: StatCardProps) {
  return (
    <Card className={`bg-card border-border p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">{icon && <div className="text-primary">{icon}</div>}</div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {change && (
          <span
            className={`text-xs font-semibold ${change.direction === "up" ? "text-green-600" : "text-destructive"}`}
          >
            {change.direction === "up" ? "↑" : "↓"} {change.value}%
          </span>
        )}
      </div>
    </Card>
  )
}
