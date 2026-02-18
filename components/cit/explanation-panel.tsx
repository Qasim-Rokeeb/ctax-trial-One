interface ExplanationPanelProps {
  reason_text: string
}

export function ExplanationPanel({ reason_text }: ExplanationPanelProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
      <p className="text-xs uppercase text-muted-foreground">Plain-English explanation</p>
      <p className="mt-3 text-sm text-foreground">{reason_text}</p>
    </div>
  )
}
