"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getAllTaxpayers } from "@/lib/mock-data"
import { getIncomeValue, getRiskProfile, getSectorLabel } from "@/lib/risk"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

export default function TaxpayersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState<"all" | "high" | "medium" | "low">("all")

  const taxpayers = useMemo(() => getAllTaxpayers(), [])

  const filtered = useMemo(() => {
    return taxpayers.filter((taxpayer) => {
      const matchesSearch =
        taxpayer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        taxpayer.rra_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (taxpayer.type === "CIT" ? taxpayer.company_name.toLowerCase() : "").includes(searchQuery.toLowerCase())

      const profile = getRiskProfile(taxpayer)
      const matchesLevel = filterLevel === "all" || profile.level === filterLevel

      return matchesSearch && matchesLevel
    })
  }, [taxpayers, searchQuery, filterLevel])

  return (
    <ProtectedLayout>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Taxpayer Directory</p>
          <h1 className="font-display text-3xl text-foreground">Taxpayers</h1>
          <p className="mt-2 text-sm text-muted-foreground">Risk score + top indicators, no edits required.</p>
        </header>

        <section className="fade-up rounded-2xl border border-border/60 bg-card/90 p-5" style={{ animationDelay: "120ms" }}>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search by name, company, or RRA ID"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="max-w-md bg-input border-border"
            />
            <div className="flex flex-wrap gap-2">
              {(["all", "high", "medium", "low"] as const).map((level) => (
                <Button
                  key={level}
                  variant={filterLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterLevel(level)}
                  className={filterLevel === level ? "bg-primary text-primary-foreground" : ""}
                >
                  {level === "all" ? "All" : `${level.charAt(0).toUpperCase() + level.slice(1)} Risk`}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {filtered.map((taxpayer, index) => {
            const profile = getRiskProfile(taxpayer)
            const indicators = profile.indicators.filter((indicator) => indicator.triggered)
            return (
              <Card
                key={taxpayer.id}
                className="fade-up border-border/60 bg-card/90 p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{taxpayer.name}</h3>
                      <Badge variant="secondary">{taxpayer.type}</Badge>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs uppercase text-primary">
                        Risk {profile.score}
                      </span>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs uppercase text-muted-foreground">
                        {profile.level} priority
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{taxpayer.rra_id}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Sector: {getSectorLabel(taxpayer)}</span>
                      <span>
                        Income: ₦{(getIncomeValue(taxpayer) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {indicators.length === 0 ? (
                        <span className="rounded-full bg-muted px-3 py-1 text-foreground">No active flags</span>
                      ) : (
                        indicators.map((indicator) => (
                          <span key={indicator.key} className="rounded-full bg-accent/20 px-3 py-1 text-accent-foreground">
                            {indicator.label}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <Link href={`/mvp/taxpayers/${taxpayer.id}`} className="flex items-center gap-2 text-sm text-primary">
                    View detail
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            )
          })}
        </section>
      </div>
    </ProtectedLayout>
  )
}
