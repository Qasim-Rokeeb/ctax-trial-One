import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon || <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-semibold text-foreground mb-2 text-center">{title}</h3>
      {description && <p className="text-muted-foreground text-sm text-center mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
