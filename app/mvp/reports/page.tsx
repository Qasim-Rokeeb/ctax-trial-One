"use client"

import { useMemo } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"
import { getAllTaxpayers } from "@/lib/mock-data"
import { getRiskProfile } from "@/lib/risk"

export default function ReportsPage() {
  const riskData = useMemo(() => {
    return getAllTaxpayers().map((taxpayer) => {
      const profile = getRiskProfile(taxpayer)
      return {
        taxpayer: taxpayer.type === "CIT" ? taxpayer.company_name : taxpayer.name,
        rra_id: taxpayer.rra_id,
        type: taxpayer.type,
        score: profile.score,
        level: profile.level,
        liability_ngn: profile.totalLiability,
        findings_count: profile.findingsCount,
      }
    })
  }, [])

  const summary = useMemo(() => {
    return riskData.reduce(
      (acc, row) => {
        acc.totalLiability += row.liability_ngn
        acc.highRisk += row.level === "high" ? 1 : 0
        acc.mediumRisk += row.level === "medium" ? 1 : 0
        return acc
      },
      { totalLiability: 0, highRisk: 0, mediumRisk: 0 },
    )
  }, [riskData])

  const handleExportCSV = () => {
    exportToCSV(riskData, `risk-table-export-${new Date().toISOString().split("T")[0]}`)
  }

  return (
    <ProtectedLayout allowedRoles={["executive", "supervisor"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <div className="flex items-center justify-between">
          <header>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">REPORTING</p>
            <h1 className="font-display text-3xl text-foreground">Export Risk Table</h1>
            <p className="mt-2 text-sm text-muted-foreground">Generate a model-driven CSV for taxpayers and risk scores.</p>
          </header>

          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-border/60 bg-card/90 p-5">
            <p className="text-xs uppercase text-muted-foreground">Records</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{riskData.length}</p>
          </Card>
          <Card className="border-border/60 bg-card/90 p-5">
            <p className="text-xs uppercase text-muted-foreground">High Risk Cases</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{summary.highRisk}</p>
          </Card>
          <Card className="border-border/60 bg-card/90 p-5">
            <p className="text-xs uppercase text-muted-foreground">Total Liability</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">₦{(summary.totalLiability / 1000000).toFixed(1)}M</p>
          </Card>
        </section>

        <Card className="border-border/60 bg-card/90 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Taxpayer</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">RRA ID</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Score</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Level</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Liability</th>
                </tr>
              </thead>
              <tbody>
                {riskData.map((row) => (
                  <tr key={row.rra_id} className="border-b border-border/20 hover:bg-accent/5 transition-colors">
                    <td className="py-4 px-4 text-sm text-foreground">{row.taxpayer}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{row.rra_id}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{row.type}</td>
                    <td className="py-4 px-4 text-sm text-foreground font-medium">{row.score}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        row.level === "high"
                          ? "bg-red-500/10 text-red-600"
                          : row.level === "medium"
                            ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-green-500/10 text-green-600"
                      }`}>
                        {row.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">₦{(row.liability_ngn / 1000000).toFixed(1)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
