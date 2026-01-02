"use client"

import { useMemo } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { MOCK_AUDIT_FINDINGS, MOCK_CIT_TAXPAYERS, MOCK_PIT_TAXPAYERS } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { RiskDistributionChart } from "@/components/executive/risk-distribution-chart"
import { TaxLiabilityBreakdown } from "@/components/executive/tax-liability-breakdown"
import { FindingsTrend } from "@/components/executive/findings-trend"
import { FindingsByCategory } from "@/components/executive/findings-by-category"
import { AlertCircle, TrendingUp, BarChart3, Users } from "lucide-react"

export default function ExecutiveDashboard() {
  const stats = useMemo(() => {
    const allFindings = MOCK_AUDIT_FINDINGS
    const totalTaxpayers = MOCK_CIT_TAXPAYERS.length + MOCK_PIT_TAXPAYERS.length
    const totalTaxLiability = allFindings.reduce((sum, f) => sum + f.estimated_tax_liability, 0)
    const highRiskFindings = allFindings.filter((f) => f.risk_level === "high").length

    return {
      totalTaxpayers,
      totalFindings: allFindings.length,
      totalTaxLiability,
      highRiskFindings,
      completionRate: ((allFindings.filter((f) => f.status === "resolved").length / allFindings.length) * 100).toFixed(
        1,
      ),
    }
  }, [])

  return (
    <ProtectedLayout requiredRole="executive">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-8">
          <h1 className="text-3xl font-bold mb-1">Executive Dashboard</h1>
          <p className="text-muted-foreground">Tax compliance audit oversight and strategic metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="border-b border-border p-8">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-card border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Taxpayers</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalTaxpayers}</p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Findings</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalFindings}</p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Tax Liability</p>
              <p className="text-3xl font-bold text-accent">₦{(stats.totalTaxLiability / 1000000).toFixed(0)}M</p>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">High Risk Findings</p>
              <p className="text-3xl font-bold text-destructive">{stats.highRiskFindings}</p>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="flex-1 overflow-auto p-8">
          <div className="space-y-6">
            {/* Top Row - Risk Distribution & Tax Liability */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Risk Distribution</h2>
                <RiskDistributionChart />
              </Card>

              <Card className="bg-card border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Tax Liability by Taxpayer Type</h2>
                <TaxLiabilityBreakdown />
              </Card>
            </div>

            {/* Second Row - Findings Trend & By Category */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-card border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Findings Over Time</h2>
                <FindingsTrend />
              </Card>

              <Card className="bg-card border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Findings by Category</h2>
                <FindingsByCategory />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
