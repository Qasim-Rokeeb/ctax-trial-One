interface GapTableProps {
  rows: { year: string; gap: string; ratio: string; flag: string }[]
}

export function GapTable({ rows }: GapTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[420px] rounded-2xl border border-border/60 bg-background/70 p-4 text-xs text-muted-foreground">
        <div className="grid grid-cols-[0.5fr_0.8fr_0.6fr_0.6fr] gap-3 font-semibold uppercase">
          <span>Year</span>
          <span>Gap</span>
          <span>Ratio</span>
          <span>Flag</span>
        </div>
        {rows.map((row) => (
          <div key={row.year} className="mt-2 grid grid-cols-[0.5fr_0.8fr_0.6fr_0.6fr] gap-3">
            <span className="text-foreground">{row.year}</span>
            <span>{row.gap}</span>
            <span>{row.ratio}</span>
            <span>{row.flag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
