"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { SectionState } from "@/components/cit/section-state"
import { RiskHistogram } from "@/components/cit/risk-histogram"
import { SectorHeatmap } from "@/components/cit/sector-heatmap"
import { RevenueAtStake } from "@/components/cit/revenue-at-stake"
import { EXECUTIVE_OVERVIEW } from "@/lib/cit-data"

export default function ExecutiveOverviewPage() {
  const histogramState = "ready" as const
  const heatmapState = "ready" as const
  const revenueState = "ready" as const

  return (
    <ProtectedLayout allowedRoles={["executive"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Executive Overview</p>
          <h1 className="font-display text-3xl text-foreground">CIT Risk Distribution</h1>
          <p className="mt-2 text-sm text-muted-foreground">Risk Identification → Assessment → Treatment → Monitoring.</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Risk Histogram</h2>
              <p className="text-xs text-muted-foreground">Distribution of risk scores by bin.</p>
            </div>
            <SectionState state={histogramState}>
              <RiskHistogram
                bins={EXECUTIVE_OVERVIEW.riskHistogram.bins}
                counts={EXECUTIVE_OVERVIEW.riskHistogram.counts}
                thresholds={EXECUTIVE_OVERVIEW.riskHistogram.thresholds}
              />
            </SectionState>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Sector Heatmap</h2>
              <p className="text-xs text-muted-foreground">Click sector blocks to drill down.</p>
            </div>
            <SectionState state={heatmapState}>
              <SectorHeatmap sectors={EXECUTIVE_OVERVIEW.sectorHeatmap.sectors as Array<{ sector: string; size: number; risk_count: number; intensity: "high" | "medium" | "low" }>} />
            </SectionState>
          </Card>
        </section>

        <section className="fade-up" style={{ animationDelay: "180ms" }}>
          <Card className="border-border/60 bg-card/90 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Revenue at Stake</h2>
              <p className="text-xs text-muted-foreground">Illustrative only. Values from server-side computation.</p>
            </div>
            <SectionState state={revenueState}>
              <RevenueAtStake
                total={EXECUTIVE_OVERVIEW.revenueAtStake.total}
                sum_gap_by_segment={EXECUTIVE_OVERVIEW.revenueAtStake.sum_gap_by_segment}
              />
            </SectionState>
          </Card>
        </section>

        <footer className="text-xs text-muted-foreground">
          Policy {EXECUTIVE_OVERVIEW.policy_version} · Computed {EXECUTIVE_OVERVIEW.computation_timestamp}
        </footer>
      </div>
    </ProtectedLayout>
  )
}
