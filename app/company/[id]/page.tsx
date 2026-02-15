"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { SectionState } from "@/components/cit/section-state"
import { TaxTimelineChart } from "@/components/cit/tax-timeline-chart"
import { GapTable } from "@/components/cit/gap-table"
import { FXCashflowChart } from "@/components/cit/fx-cashflow-chart"
import { PeerBoxplot } from "@/components/cit/peer-boxplot"
import { ExplanationPanel } from "@/components/cit/explanation-panel"
import { COMPANY_INVESTIGATION } from "@/lib/cit-data"

export default function CompanyInvestigationPage() {
  const params = useParams()
  const company = useMemo(() => COMPANY_INVESTIGATION.company, [params.id])
  const timelineState = "ready" as const
  const gapState = "ready" as const
  const fxState = "ready" as const
  const peerState = "ready" as const

  return (
    <ProtectedLayout allowedRoles={["auditor", "supervisor", "executive"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Company Investigation</p>
          <h1 className="font-display text-3xl text-foreground">{company.name}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>RC {company.rc}</span>
            <span>TIN {company.tin}</span>
            <span>Case {company.case_id}</span>
            <span>Risk score {company.risk_score}</span>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Tax Timeline</h2>
              <p className="text-xs text-muted-foreground">CIT/VAT/EDT computed vs reported.</p>
            </div>
            <SectionState state={timelineState}>
              <TaxTimelineChart
                cit={COMPANY_INVESTIGATION.taxTimeline.cit}
                vat={COMPANY_INVESTIGATION.taxTimeline.vat}
                edt={COMPANY_INVESTIGATION.taxTimeline.edt}
              />
            </SectionState>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Gap Table</h2>
              <p className="text-xs text-muted-foreground">Sortable on server.</p>
            </div>
            <SectionState state={gapState}>
              <GapTable rows={COMPANY_INVESTIGATION.gapTable} />
            </SectionState>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">FX Cashflow</h2>
              <p className="text-xs text-muted-foreground">Tooltip shows FX source.</p>
            </div>
            <SectionState state={fxState}>
              <FXCashflowChart rows={COMPANY_INVESTIGATION.fxCashflow} />
            </SectionState>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Peer Benchmark</h2>
              <p className="text-xs text-muted-foreground">Peer definition visible to auditors.</p>
            </div>
            <SectionState state={peerState}>
              <PeerBoxplot
                median={COMPANY_INVESTIGATION.peerBoxplot.median}
                iqr_low={COMPANY_INVESTIGATION.peerBoxplot.iqr_low}
                iqr_high={COMPANY_INVESTIGATION.peerBoxplot.iqr_high}
                value={COMPANY_INVESTIGATION.peerBoxplot.value}
                zscore={COMPANY_INVESTIGATION.peerBoxplot.zscore}
              />
            </SectionState>
          </Card>
        </section>

        <section className="fade-up" style={{ animationDelay: "180ms" }}>
          <Card className="border-border/60 bg-card/90 p-6">
            <h2 className="text-lg font-semibold text-foreground">Explanation Panel</h2>
            <ExplanationPanel reason_text={COMPANY_INVESTIGATION.explanation.reason_text} />
          </Card>
        </section>

        <footer className="text-xs text-muted-foreground">
          Policy {COMPANY_INVESTIGATION.policy_version} · Computed {COMPANY_INVESTIGATION.computation_timestamp}
        </footer>
      </div>
    </ProtectedLayout>
  )
}
