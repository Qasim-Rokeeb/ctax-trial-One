"use client"

import { useMemo } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { getAllTaxpayers, MOCK_CIT_TAXPAYERS, MOCK_PIT_TAXPAYERS } from "@/lib/mock-data"
import { getRiskProfile, getIncomeValue, getSectorLabel } from "@/lib/risk"
import { TrendingUp, ShieldCheck, AlertTriangle, FileText } from "lucide-react"

export default function MvpDashboardPage() {
  const metrics = useMemo(() => {
    const taxpayers = getAllTaxpayers()
    const profiles = taxpayers.map((taxpayer) => getRiskProfile(taxpayer))

    const totals = profiles.reduce(
      (acc, profile) => {
        acc.high += profile.level === "high" ? 1 : 0
        acc.medium += profile.level === "medium" ? 1 : 0
        acc.low += profile.level === "low" ? 1 : 0
        acc.score += profile.score
        acc.liability += profile.totalLiability
        return acc
      },
      { high: 0, medium: 0, low: 0, score: 0, liability: 0 },
    )

    return {
      total: taxpayers.length,
      avgScore: totals.score / Math.max(taxpayers.length, 1),
      highRisk: totals.high,
      lowRisk: totals.low,
      totalLiability: totals.liability,
      chartData: [
        { name: "High", value: totals.high },
        { name: "Medium", value: totals.medium },
        { name: "Low", value: totals.low },
      ],
    }
  }, [])

  const streamRows = [
    { label: "VAT", taxpayer: MOCK_CIT_TAXPAYERS[1] ?? MOCK_CIT_TAXPAYERS[0] },
    { label: "CIT", taxpayer: MOCK_CIT_TAXPAYERS[0] },
    { label: "Pensions", taxpayer: MOCK_PIT_TAXPAYERS[0] },
    { label: "ADT", taxpayer: MOCK_PIT_TAXPAYERS[1] ?? MOCK_PIT_TAXPAYERS[0] },
  ].filter((row) => row.taxpayer)

  return (
    <ProtectedLayout allowedRoles={["executive", "supervisor"]}>
      <div className="flex h-full flex-col gap-8 p-8">
        <header className="fade-up flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">MVP Overview</p>
            <h1 className="font-display text-4xl text-foreground">Executive Dashboard</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Track risk profiling coverage, taxpayer exposure, and quick signals from the one-month MVP dataset.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Download Snapshot</Button>
            <Button className="bg-primary text-primary-foreground">Share with leadership</Button>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-4">
          <Card className="fade-up border-border/60 bg-card/90 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Total Taxpayers</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{metrics.total}</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Avg Risk Score</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{metrics.avgScore.toFixed(0)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </Card>
          <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">High Risk</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{metrics.highRisk}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </Card>
          <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "240ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Low Risk</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{metrics.lowRisk}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Risk Category Distribution</h2>
              <span className="text-xs text-muted-foreground">Count of high vs low taxpayers</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={metrics.chartData} barSize={42}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--color-border))" />
                <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" />
                <YAxis stroke="hsl(var(--color-muted-foreground))" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--color-primary))" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="text-lg font-semibold text-foreground">Tax Stream Snapshot</h2>
            <p className="mt-1 text-xs text-muted-foreground">VAT, CIT, Pensions, ADT by sector</p>
            <div className="mt-4 space-y-3">
              {streamRows.map((row) => (
                <div key={row.label} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{row.label}</span>
                    <span className="text-xs text-muted-foreground">{getSectorLabel(row.taxpayer)}</span>
                  </div>
                  <div className="mt-2 text-sm text-foreground">
                    {row.taxpayer.type === "CIT" ? row.taxpayer.company_name : row.taxpayer.name}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Income: ₦{(getIncomeValue(row.taxpayer) / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="fade-up grid gap-4 lg:grid-cols-3" style={{ animationDelay: "200ms" }}>
          <Card className="border-border/60 bg-card/90 p-5">
            <h3 className="text-sm font-semibold text-foreground">MVP Coverage</h3>
            <p className="mt-2 text-xs text-muted-foreground">Indicators mapped to each taxpayer</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>Late filing flag</span>
              <span className="font-semibold text-foreground">45 pts</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>Income discrepancy flag</span>
              <span className="font-semibold text-foreground">55 pts</span>
            </div>
          </Card>
          <Card className="border-border/60 bg-card/90 p-5">
            <h3 className="text-sm font-semibold text-foreground">Top Exposure</h3>
            <p className="mt-2 text-xs text-muted-foreground">Estimated liability in pipeline</p>
            <p className="mt-6 text-3xl font-semibold text-foreground">
              ₦{(metrics.totalLiability / 1000000).toFixed(1)}M
            </p>
          </Card>
          <Card className="border-border/60 bg-card/90 p-5">
            <h3 className="text-sm font-semibold text-foreground">Next Steps</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>Validate CSV fields against required schema.</li>
              <li>Confirm risk weights with audit leadership.</li>
              <li>Export taxpayer risk table for review.</li>
            </ul>
          </Card>
        </section>
      </div>
    </ProtectedLayout>
  )
}
