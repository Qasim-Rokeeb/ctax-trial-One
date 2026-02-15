"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { SectionState } from "@/components/cit/section-state"
import { CompanyGrid } from "@/components/cit/company-grid"
import { RiskDriverPanel } from "@/components/cit/risk-driver-panel"
import { AssignCaseModal } from "@/components/cit/assign-case-modal"
import { SUPERVISOR_QUEUE } from "@/lib/cit-data"

export default function SupervisorQueuePage() {
  const gridState = "ready" as const

  return (
    <ProtectedLayout allowedRoles={["supervisor"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Supervisor Queue</p>
            <h1 className="font-display text-3xl text-foreground">Cases Awaiting Assignment</h1>
            <p className="mt-2 text-sm text-muted-foreground">Server-side paging. No client-side recalculation.</p>
          </div>
          <AssignCaseModal case_id={SUPERVISOR_QUEUE.companies[0].company_id} auditors={SUPERVISOR_QUEUE.auditors} />
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Company Grid</h2>
              <p className="text-xs text-muted-foreground">Risk score and drivers (server-provided).</p>
            </div>
            <SectionState state={gridState}>
              <CompanyGrid companies={SUPERVISOR_QUEUE.companies} paging={SUPERVISOR_QUEUE.paging} />
            </SectionState>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Risk Driver Panel</h2>
              <p className="text-xs text-muted-foreground">Why flagged in under 30 seconds.</p>
            </div>
            <RiskDriverPanel
              gap={SUPERVISOR_QUEUE.driverPanel.gap}
              persistence={SUPERVISOR_QUEUE.driverPanel.persistence}
              cashflow={SUPERVISOR_QUEUE.driverPanel.cashflow}
              peer={SUPERVISOR_QUEUE.driverPanel.peer}
            />
          </Card>
        </section>

        <footer className="text-xs text-muted-foreground">
          Policy {SUPERVISOR_QUEUE.policy_version} · Computed {SUPERVISOR_QUEUE.computation_timestamp}
        </footer>
      </div>
    </ProtectedLayout>
  )
}
