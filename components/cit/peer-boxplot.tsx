interface PeerBoxplotProps {
  median: string
  iqr_low: string
  iqr_high: string
  value: string
  zscore: string
}

export function PeerBoxplot({ median, iqr_low, iqr_high, value, zscore }: PeerBoxplotProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
        <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
          <span>Peer distribution</span>
          <span>Z-score {zscore}</span>
        </div>
        <div className="mt-4 h-3 rounded-full bg-muted">
          <div className="relative h-3 rounded-full bg-accent/50">
            <div className="absolute left-[20%] top-0 h-3 w-2 rounded bg-accent" />
            <div className="absolute left-[60%] top-0 h-3 w-2 rounded bg-primary" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap justify-between text-xs text-muted-foreground">
          <span>IQR low {iqr_low}</span>
          <span>Median {median}</span>
          <span>IQR high {iqr_high}</span>
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-4 text-sm">
        <p className="text-muted-foreground">Company value</p>
        <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
