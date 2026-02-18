interface RevenueAtStakeProps {
  total: { label: string; value: string; unit: string }
  sum_gap_by_segment: { segment: string; value: string; unit: string }[]
}

export function RevenueAtStake({ total, sum_gap_by_segment }: RevenueAtStakeProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
        <p className="text-xs uppercase text-muted-foreground">{total.label}</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">{total.value}</p>
        <p className="text-xs text-muted-foreground">Unit: {total.unit}</p>
      </div>

      <div className="space-y-2">
        {sum_gap_by_segment.map((segment) => (
          <div key={segment.segment} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm">
            <span className="text-foreground">{segment.segment}</span>
            <span className="text-muted-foreground">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
