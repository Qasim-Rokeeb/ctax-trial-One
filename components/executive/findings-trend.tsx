"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { MOCK_AUDIT_FINDINGS } from "@/lib/mock-data"

export function FindingsTrend() {
  const data = [
    { date: "Jan", findings: 2 },
    { date: "Feb", findings: 2 },
    { date: "Mar", findings: 2 },
    { date: "Apr", findings: 2 },
    { date: "May", findings: 2 },
    { date: "Jun", findings: MOCK_AUDIT_FINDINGS.length },
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--color-border))" />
        <XAxis dataKey="date" stroke="hsl(var(--color-muted-foreground))" />
        <YAxis stroke="hsl(var(--color-muted-foreground))" />
        <Tooltip
          contentStyle={{ backgroundColor: "hsl(var(--color-card))", border: "1px solid hsl(var(--color-border))" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="findings"
          stroke="hsl(var(--color-primary))"
          strokeWidth={2}
          dot={{ fill: "hsl(var(--color-primary))", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
