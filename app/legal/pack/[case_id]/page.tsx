"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExhibitRenderer } from "@/components/cit/exhibit-renderer"
import { AuditTrailTable } from "@/components/cit/audit-trail-table"
import { LEGAL_PACK } from "@/lib/cit-data"

export default function LegalPackPage() {
  const params = useParams()
  const pack = useMemo(() => LEGAL_PACK, [params.case_id])

  return (
    <ProtectedLayout allowedRoles={["supervisor", "executive"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Legal Export</p>
            <h1 className="font-display text-3xl text-foreground">Tribunal Pack</h1>
            <p className="mt-2 text-sm text-muted-foreground">Case ID {pack.case_id}</p>
          </div>
          <Button className="bg-primary text-primary-foreground">Export PDF</Button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Exhibits</h2>
              <p className="text-xs text-muted-foreground">Frozen snapshot. Immutable once generated.</p>
            </div>
            <ExhibitRenderer exhibits={pack.exhibits} />
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Audit Trail</h2>
              <p className="text-xs text-muted-foreground">Append-only log.</p>
            </div>
            <AuditTrailTable events={pack.auditTrail.events} />
          </Card>
        </section>

        <footer className="text-xs text-muted-foreground">
          Policy {pack.policy_version} · Computed {pack.computation_timestamp}
        </footer>
      </div>
    </ProtectedLayout>
  )
}
