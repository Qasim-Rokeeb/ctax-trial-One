"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface RiskDriverPanelProps {
  gap: string
  persistence: string
  cashflow: string
  peer: string
}

export function RiskDriverPanel({ gap, persistence, cashflow, peer }: RiskDriverPanelProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Why flagged</h3>
        <Button variant="ghost" size="sm" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      {expanded && (
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Gap</span>
            <span className="text-foreground">{gap}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Persistence</span>
            <span className="text-foreground">{persistence}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Cashflow</span>
            <span className="text-foreground">{cashflow}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Peer position</span>
            <span className="text-foreground">{peer}</span>
          </div>
        </div>
      )}
    </div>
  )
}
