"use client"
import { X } from "lucide-react"

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full border border-border">
      <span className="text-sm text-foreground">
        {label}: <strong>{value}</strong>
      </span>
      <button onClick={onRemove} className="text-muted-foreground hover:text-foreground transition-colors">
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
