"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MOCK_AUDIT_FINDINGS, MOCK_CIT_TAXPAYERS, MOCK_PIT_TAXPAYERS } from "@/lib/mock-data"

export function TaxLiabilityBreakdown() {
  const citLiability = MOCK_AUDIT_FINDINGS.filter((f) =>
    MOCK_CIT_TAXPAYERS.some((tp) => tp.id === f.taxpayer_id),
  ).reduce((sum, f) => sum + f.estimated_tax_liability, 0)

  const pitLiability = MOCK_AUDIT_FINDINGS.filter((f) =>
    MOCK_PIT_TAXPAYERS.some((tp) => tp.id === f.taxpayer_id),
  ).reduce((sum, f) => sum + f.estimated_tax_liability, 0)

  const data = [
    { name: "CIT", liability: citLiability / 1000000 },
    { name: "PIT", liability: pitLiability / 1000000 },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
        <XAxis dataKey="name" stroke="hsl(var(--color-muted-foreground))" />
        <YAxis
          stroke="hsl(var(--color-muted-foreground))"
          label={{ value: "₦ Millions", angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          formatter={(value) => `₦${value.toFixed(1)}M`}
          contentStyle={{ backgroundColor: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
        />
        <Bar dataKey="liability" fill="hsl(var(--color-chart-1))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
