"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { MOCK_AUDIT_FINDINGS } from "@/lib/mock-data"

export function RiskDistributionChart() {
  const data = [
    { name: "High Risk", value: MOCK_AUDIT_FINDINGS.filter((f) => f.risk_level === "high").length },
    { name: "Medium Risk", value: MOCK_AUDIT_FINDINGS.filter((f) => f.risk_level === "medium").length },
    { name: "Low Risk", value: MOCK_AUDIT_FINDINGS.filter((f) => f.risk_level === "low").length },
  ]

  const COLORS = ["hsl(var(--color-destructive))", "hsl(var(--color-accent))", "hsl(134, 61%, 56%)"]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}`}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}
