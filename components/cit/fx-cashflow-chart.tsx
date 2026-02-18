"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface FXRow {
  year: string
  inflow_ngn: number
  outflow_ngn: number
  fx_source: string
}

interface FXCashflowChartProps {
  rows: FXRow[]
}

export function FXCashflowChart({ rows }: FXCashflowChartProps) {
  return (
    <div className="space-y-3">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} barSize={28}>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="year" stroke="hsl(var(--color-muted-foreground))" />
            <YAxis stroke="hsl(var(--color-muted-foreground))" />
            <Tooltip
              formatter={(value, name, props) => {
                const source = (props.payload as FXRow).fx_source
                return [`${value} NGN`, `${name} | ${source}`]
              }}
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
              }}
            />
            <Bar dataKey="inflow_ngn" fill="hsl(var(--color-primary))" radius={[6, 6, 0, 0]} />
            <Bar dataKey="outflow_ngn" fill="hsl(var(--color-accent))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[420px] rounded-2xl border border-border/60 bg-background/70 p-4 text-xs text-muted-foreground">
          <div className="grid grid-cols-[0.5fr_0.8fr_0.8fr_1fr] gap-3 font-semibold uppercase">
            <span>Year</span>
            <span>Inflow</span>
            <span>Outflow</span>
            <span>FX source</span>
          </div>
          {rows.map((row) => (
            <div key={row.year} className="mt-2 grid grid-cols-[0.5fr_0.8fr_0.8fr_1fr] gap-3">
              <span className="text-foreground">{row.year}</span>
              <span>{row.inflow_ngn} NGN</span>
              <span>{row.outflow_ngn} NGN</span>
              <span>{row.fx_source}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
