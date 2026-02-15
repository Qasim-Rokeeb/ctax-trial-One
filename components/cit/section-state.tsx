import type React from "react"

export type SectionStateType = "ready" | "loading" | "empty" | "error"

interface SectionStateProps {
  state: SectionStateType
  children: React.ReactNode
  emptyMessage?: string
  errorMessage?: string
  referenceId?: string | null
}

export function SectionState({
  state,
  children,
  emptyMessage = "No data available for period",
  errorMessage = "We could not load this section.",
  referenceId,
}: SectionStateProps) {
  if (state === "loading") {
    return (
      <div className="space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4">
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (state === "empty") {
    return <div className="rounded-2xl border border-dashed border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">{emptyMessage}</div>
  }

  if (state === "error") {
    return (
      <div className="rounded-2xl border border-destructive/40 bg-background/70 p-4 text-sm text-destructive">
        <p>{errorMessage}</p>
        <p className="mt-2 text-xs text-muted-foreground">Reference ID: {referenceId ?? "N/A"}</p>
      </div>
    )
  }

  return <>{children}</>
}
