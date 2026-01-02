import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

interface RiskBadgeProps {
  level: "high" | "medium" | "low"
  children?: ReactNode
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const riskConfig = {
    high: { label: "HIGH RISK", className: "bg-destructive text-destructive-foreground" },
    medium: { label: "MEDIUM RISK", className: "bg-accent text-accent-foreground" },
    low: { label: "LOW RISK", className: "bg-green-600 text-white" },
  }

  const config = riskConfig[level]

  return <Badge className={`text-xs font-semibold ${config.className}`}>{config.label}</Badge>
}
