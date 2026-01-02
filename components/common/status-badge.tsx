import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "open" | "in_review" | "resolved"
  children?: ReactNode
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    open: { label: "Open", className: "bg-destructive text-destructive-foreground" },
    in_review: { label: "In Review", className: "bg-accent text-accent-foreground" },
    resolved: { label: "Resolved", className: "bg-green-600 text-white" },
  }

  const config = statusConfig[status]

  return <Badge className={config.className}>{config.label}</Badge>
}
