interface AuditTrailTableProps {
  events: { id: string; timestamp: string; actor: string; action: string }[]
}

export function AuditTrailTable({ events }: AuditTrailTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-130 rounded-2xl border border-border/60 bg-background/70 p-4 text-xs text-muted-foreground">
        <div className="grid grid-cols-[0.7fr_0.7fr_1fr] gap-3 font-semibold uppercase">
          <span>Timestamp</span>
          <span>Actor</span>
          <span>Action</span>
        </div>
        {events.map((event) => (
          <div key={event.id} className="mt-2 grid grid-cols-[0.7fr_0.7fr_1fr] gap-3">
            <span className="text-foreground">{event.timestamp}</span>
            <span>{event.actor}</span>
            <span>{event.action}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
