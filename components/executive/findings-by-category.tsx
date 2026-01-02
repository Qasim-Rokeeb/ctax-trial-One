"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MOCK_AUDIT_FINDINGS } from "@/lib/mock-data"

export function FindingsByCategory() {
  const categories = Array.from(new Set(MOCK_AUDIT_FINDINGS.map((f) => f.category)))
  const data = categories.map((cat) => ({
    category: cat,
    count: MOCK_AUDIT_FINDINGS.filter((f) => f.category === cat).length,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
        <XAxis
          dataKey="category"
          stroke="hsl(var(--color-muted-foreground))"
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="hsl(var(--color-muted-foreground))" />
        <Tooltip
          contentStyle={{ backgroundColor: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
        />
        <Bar dataKey="count" fill="hsl(var(--color-chart-2))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
