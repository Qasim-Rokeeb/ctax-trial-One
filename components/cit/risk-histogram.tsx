"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface RiskHistogramProps {
  bins: string[]
  counts: number[]
  thresholds: number[]
}

export function RiskHistogram({ bins, counts, thresholds }: RiskHistogramProps) {
  const data = bins.map((bin, index) => ({
    bin,
    count: counts[index] ?? 0,
    threshold: thresholds[index] ?? null,
  }))

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={36}>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="bin" stroke="hsl(var(--color-muted-foreground))" />
            <YAxis stroke="hsl(var(--color-muted-foreground))" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[420px] rounded-2xl border border-border/60 bg-background/70 p-4 text-xs text-muted-foreground">
          <div className="grid grid-cols-[0.7fr_0.5fr_0.5fr] gap-3 font-semibold uppercase">
            <span>Bin</span>
            <span>Count</span>
            <span>Threshold</span>
          </div>
          {data.map((row) => (
            <div key={row.bin} className="mt-2 grid grid-cols-[0.7fr_0.5fr_0.5fr] gap-3">
              <span className="text-foreground">{row.bin}</span>
              <span>{row.count}</span>
              <span>{row.threshold ?? "-"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
