interface SectorHeatmapProps {
  sectors: { sector: string; size: number; risk_count: number; intensity: "low" | "medium" | "high" }[]
}

const INTENSITY_STYLES: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-accent/30 text-accent-foreground",
  high: "bg-destructive/20 text-destructive",
}

export function SectorHeatmap({ sectors }: SectorHeatmapProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {sectors.map((sector) => (
        <div key={sector.sector} className="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
            <span>{sector.sector}</span>
            <span>{sector.size} companies</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className={`rounded-full px-3 py-1 text-xs ${INTENSITY_STYLES[sector.intensity]}`}>
              {sector.risk_count} risk cases
            </span>
            <span className="text-xs text-muted-foreground">Drill-down ready</span>
          </div>
        </div>
      ))}
    </div>
  )
}
