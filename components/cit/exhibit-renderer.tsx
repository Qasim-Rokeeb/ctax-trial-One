interface ExhibitRendererProps {
  exhibits: { exhibit_type: string; data: string }[]
}

export function ExhibitRenderer({ exhibits }: ExhibitRendererProps) {
  return (
    <div className="space-y-3">
      {exhibits.map((exhibit) => (
        <div key={exhibit.data} className="rounded-2xl border border-border/60 bg-background/70 p-4">
          <p className="text-xs uppercase text-muted-foreground">{exhibit.exhibit_type}</p>
          <p className="mt-2 text-sm text-foreground">{exhibit.data}</p>
          <p className="mt-2 text-xs text-muted-foreground">Frozen snapshot</p>
        </div>
      ))}
    </div>
  )
}
