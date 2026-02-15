"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSessionFromStorage } from "@/lib/session"
import { getAuditQueueForUser } from "@/lib/mock-data"
import { getRiskProfile } from "@/lib/risk"
import { AlertCircle, FileCheck, TrendingUp } from "lucide-react"

export default function MvpQueuePage() {
  const router = useRouter()
  const session = getSessionFromStorage()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRisk, setFilterRisk] = useState<"all" | "high" | "medium" | "low">("all")

  const queue = useMemo(() => {
    if (!session.user) return []
    return getAuditQueueForUser(session.user.id)
  }, [session.user])

  const filtered = useMemo(() => {
    return queue.filter((item) => {
      const matchesSearch =
        item.taxpayer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.taxpayer?.rra_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.finding.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRisk = filterRisk === "all" || item.finding.risk_level === filterRisk

      return matchesSearch && matchesRisk
    })
  }, [queue, searchQuery, filterRisk])

  return (
    <ProtectedLayout requiredRole="auditor">
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Auditor Workbench</p>
          <h1 className="font-display text-3xl text-foreground">Audit Work Queue</h1>
          <p className="mt-2 text-sm text-muted-foreground">{filtered.length} items waiting for review</p>
        </header>

        <section className="fade-up rounded-2xl border border-border/60 bg-card/90 p-5" style={{ animationDelay: "120ms" }}>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search by taxpayer, RRA ID, or category"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="max-w-md bg-input border-border"
            />
            <div className="flex flex-wrap gap-2">
              {(["all", "high", "medium", "low"] as const).map((risk) => (
                <Button
                  key={risk}
                  variant={filterRisk === risk ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterRisk(risk)}
                  className={filterRisk === risk ? "bg-primary text-primary-foreground" : ""}
                >
                  {risk === "all" ? "All" : `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/90 py-12 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">No items match the current filters.</p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const taxpayer = item.taxpayer
              if (!taxpayer) return null
              const profile = getRiskProfile(taxpayer)
              return (
                <Card
                  key={item.finding.id}
                  className="fade-up border-border/60 bg-card/90 p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{taxpayer.name}</h3>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs uppercase text-primary">
                          Risk {profile.score}
                        </span>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs uppercase text-muted-foreground">
                          {item.finding.risk_level} priority
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{taxpayer.rra_id}</p>
                      <p className="mt-3 text-sm text-foreground">{item.finding.description}</p>
                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4" />
                          {item.finding.evidence_count} evidence files
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          ₦{(item.finding.estimated_tax_liability / 1000000).toFixed(1)}M liability
                        </div>
                      </div>
                    </div>
                    <Button
                      className="bg-primary text-primary-foreground"
                      onClick={() => router.push(`/mvp/taxpayers/${item.finding.taxpayer_id}`)}
                    >
                      Review case
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </section>
      </div>
    </ProtectedLayout>
  )
}
