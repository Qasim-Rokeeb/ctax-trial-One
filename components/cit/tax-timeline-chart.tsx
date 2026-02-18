"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TimelineRow {
  year: string
  computed: number
  reported: number
  unit: string
}

interface TaxTimelineChartProps {
  cit: TimelineRow[]
  vat: TimelineRow[]
  edt: TimelineRow[]
}

function TimelineChart({ rows }: { rows: TimelineRow[] }) {
  return (
    <div className="space-y-3">
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--color-border))" />
            <XAxis dataKey="year" stroke="hsl(var(--color-muted-foreground))" />
            <YAxis stroke="hsl(var(--color-muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--color-card))",
                border: "1px solid hsl(var(--color-border))",
              }}
            />
            <Line type="monotone" dataKey="computed" stroke="hsl(var(--color-primary))" strokeWidth={2} />
            <Line type="monotone" dataKey="reported" stroke="hsl(var(--color-accent))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[420px] rounded-2xl border border-border/60 bg-background/70 p-4 text-xs text-muted-foreground">
          <div className="grid grid-cols-[0.5fr_0.8fr_0.8fr] gap-3 font-semibold uppercase">
            <span>Year</span>
            <span>Computed</span>
            <span>Reported</span>
          </div>
          {rows.map((row) => (
            <div key={row.year} className="mt-2 grid grid-cols-[0.5fr_0.8fr_0.8fr] gap-3">
              <span className="text-foreground">{row.year}</span>
              <span>
                {row.computed} {row.unit}
              </span>
              <span>
                {row.reported} {row.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TaxTimelineChart({ cit, vat, edt }: TaxTimelineChartProps) {
  return (
    <Tabs defaultValue="cit" className="space-y-4">
      <TabsList>
        <TabsTrigger value="cit">CIT</TabsTrigger>
        <TabsTrigger value="vat">VAT</TabsTrigger>
        <TabsTrigger value="edt">EDT</TabsTrigger>
      </TabsList>
      <TabsContent value="cit">
        <TimelineChart rows={cit} />
      </TabsContent>
      <TabsContent value="vat">
        <TimelineChart rows={vat} />
      </TabsContent>
      <TabsContent value="edt">
        <TimelineChart rows={edt} />
      </TabsContent>
    </Tabs>
  )
}
