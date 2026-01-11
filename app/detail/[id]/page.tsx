"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { getTaxpayerById, getFindingsByTaxpayer } from "@/lib/mock-data"
import type { CITTaxpayer, PITTaxpayer, AuditFinding } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TaxpayerHeader } from "@/components/detail/taxpayer-header"
import { FindingsList } from "@/components/detail/findings-list"
import { TaxpayerInfo } from "@/components/detail/taxpayer-info"
import { AlertTriangle, ArrowLeft, BarChart3, TrendingUp } from "lucide-react"

export default function DetailPage() {
  const params = useParams()
  const router = useRouter()
  const [taxpayer, setTaxpayer] = useState<(CITTaxpayer | PITTaxpayer) | null>(null)
  const [findings, setFindings] = useState<AuditFinding[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    const tp = getTaxpayerById(id)
    const auditFindings = getFindingsByTaxpayer(id)

    setTaxpayer(tp || null)
    setFindings(auditFindings)
    setIsLoading(false)
  }, [params.id])

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading taxpayer details...</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (!taxpayer) {
    return (
      <ProtectedLayout>
        <div className="p-8">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">Taxpayer Not Found</h2>
            <p className="text-muted-foreground">The taxpayer record you requested does not exist.</p>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  const totalTaxLiability = findings.reduce((sum, f) => sum + f.estimated_tax_liability, 0)
  const highRiskCount = findings.filter((f) => f.risk_level === "high").length
  const openFindings = findings.filter((f) => f.status !== "resolved").length
  const evidenceTotal = findings.reduce((sum, f) => sum + f.evidence_count, 0)
  const averageLiability = findings.length ? totalTaxLiability / findings.length : 0

  return (
    <ProtectedLayout>
      <div className="relative h-full overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(80,145,255,0.14),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(0,225,255,0.1),transparent_25%)]">
        <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-16 right-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        </div>

        <div className="relative h-full flex flex-col gap-6 p-6 lg:p-8">
          {/* Header */}
          <div className="rounded-2xl border border-border/60 bg-card/80 shadow-xl backdrop-blur">
            <div className="flex flex-col gap-6 border-b border-border/60 p-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  Live audit snapshot
                </div>
                <TaxpayerHeader taxpayer={taxpayer} />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => router.back()} variant="outline" className="border-border/80">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button variant="secondary" className="border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Export Snapshot
                </Button>
                <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25">
                  Unlock Insights
                </Button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 border-t border-border/60 p-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden border-border/60 bg-card/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/20 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">RRA ID</p>
                    <p className="text-lg font-semibold text-foreground">{taxpayer.rra_id}</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/15 text-primary">
                    Verified
                  </Badge>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-border/60 bg-card/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/20 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Registered</p>
                    <p className="text-lg font-semibold text-foreground">
                      {new Date(taxpayer.registration_date).toLocaleDateString()}
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </Card>

              <Card className="relative overflow-hidden border-border/60 bg-card/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/20 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Findings</p>
                    <p className="text-lg font-semibold text-foreground">{findings.length}</p>
                  </div>
                  <Badge variant="secondary" className="bg-destructive/15 text-destructive">
                    {highRiskCount} high risk
                  </Badge>
                </div>
              </Card>

              <Card className="relative overflow-hidden border-border/60 bg-card/80 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-primary/20 hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tax Liability</p>
                    <p className="text-lg font-semibold text-accent">₦{(totalTaxLiability / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground">Avg ₦{(averageLiability / 1000000).toFixed(1)}M per finding</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Insight Band */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="relative overflow-hidden border-border/60 bg-card/80 p-5 shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Open vs. resolved</p>
                  <h3 className="text-2xl font-semibold text-foreground">{openFindings} open</h3>
                  <p className="text-xs text-muted-foreground">{findings.length - openFindings} resolved or in review</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {["open", "in_review", "resolved"].map((status) => {
                  const value = findings.filter((f) => f.status === status).length
                  const percentage = findings.length ? Math.round((value / findings.length) * 100) : 0
                  const label =
                    status === "open" ? "Open" : status === "in_review" ? "In Review" : "Resolved"

                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{label}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            status === "open"
                              ? "from-destructive to-orange-500"
                              : status === "in_review"
                                ? "from-accent to-primary"
                                : "from-green-500 to-emerald-400"
                          } transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="relative overflow-hidden border-border/60 bg-card/80 p-5 shadow-lg shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Evidence coverage</p>
                  <h3 className="text-2xl font-semibold text-foreground">{evidenceTotal} files</h3>
                  <p className="text-xs text-muted-foreground">Supporting documents across all findings</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {findings.slice(0, 3).map((finding) => (
                  <div
                    key={finding.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm transition-colors duration-300 hover:border-primary/40"
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      <span className="truncate">{finding.category}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{finding.evidence_count} items</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary via-primary/90 to-accent text-primary-foreground shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 opacity-30" aria-hidden>
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-3xl" />
                <div className="absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-accent/30 blur-2xl" />
              </div>
              <div className="relative space-y-4 p-5">
                <p className="text-sm uppercase tracking-[0.2em]">Pro Mode</p>
                <h3 className="text-2xl font-semibold leading-tight">Unlock deeper audit automation and faster alerts.</h3>
                <p className="text-sm text-primary-foreground/80">Upgrade to enable predictive risk flags and CSV exports.</p>
                <div className="flex flex-wrap gap-2 text-xs text-primary-foreground/80">
                  <span className="rounded-full bg-white/15 px-3 py-1">Auto alerts</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">Bulk exports</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">Workflow rules</span>
                </div>
                <Button variant="secondary" className="mt-2 border border-white/30 bg-white/15 text-primary-foreground">
                  Unlock now
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <Card className="border-border/60 bg-card/80 p-4 shadow-lg shadow-primary/5">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-secondary/80 border-border/60">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="findings">Findings ({findings.length})</TabsTrigger>
                  <TabsTrigger value="information">Taxpayer Information</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 pt-6">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                      Real-time risk summary
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Risk Summary</h2>
                    <Card className="mt-4 border-border/60 bg-card/70 p-6 shadow-inner shadow-primary/5">
                      <div className="space-y-4">
                        {findings.length === 0 ? (
                          <p className="text-muted-foreground">No audit findings at this time.</p>
                        ) : (
                          findings.slice(0, 3).map((finding) => (
                            <div
                              key={finding.id}
                              className="group rounded-lg border border-border/60 bg-background/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary/10 hover:shadow-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{finding.category}</h4>
                                    <p className="text-xs text-muted-foreground">{new Date(finding.created_date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <Badge
                                  className={`text-xs ${
                                    finding.risk_level === "high"
                                      ? "bg-destructive text-destructive-foreground"
                                      : finding.risk_level === "medium"
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-green-600 text-white"
                                  }`}
                                >
                                  {finding.risk_level.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{finding.description}</p>
                              <div className="flex items-center justify-between text-sm">
                                <p className="font-medium text-accent">
                                  Estimated Liability: ₦{(finding.estimated_tax_liability / 1000000).toFixed(1)}M
                                </p>
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                  {finding.status.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Findings Tab */}
                <TabsContent value="findings" className="pt-6">
                  <FindingsList findings={findings} />
                </TabsContent>

                {/* Taxpayer Info Tab */}
                <TabsContent value="information" className="pt-6">
                  <TaxpayerInfo taxpayer={taxpayer} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
