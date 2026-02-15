"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTaxpayerById, getFindingsByTaxpayer } from "@/lib/mock-data"
import { getIncomeValue, getRiskProfile, getSectorLabel } from "@/lib/risk"
import { ArrowLeft, FileText, ShieldCheck, TrendingUp } from "lucide-react"

export default function TaxpayerDetailPage() {
  const router = useRouter()
  const params = useParams()

  const taxpayer = useMemo(() => getTaxpayerById(params.id as string), [params.id])
  const findings = useMemo(() => (taxpayer ? getFindingsByTaxpayer(taxpayer.id) : []), [taxpayer])

  if (!taxpayer) {
    return (
      <ProtectedLayout>
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
          <p className="text-lg font-semibold text-foreground">Taxpayer not found</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </ProtectedLayout>
    )
  }

  const profile = getRiskProfile(taxpayer)
  const totalLiability = findings.reduce((sum, finding) => sum + finding.estimated_tax_liability, 0)

  const streamRows = [
    { label: "VAT", sector: getSectorLabel(taxpayer) },
    { label: "CIT", sector: taxpayer.type === "CIT" ? taxpayer.business_type : "Professional Services" },
    { label: "Pensions", sector: taxpayer.type === "PIT" ? taxpayer.occupation : "Employee Contributions" },
    { label: "ADT", sector: taxpayer.type === "CIT" ? "Additional Duty" : "Additional Duty" },
  ]

  return (
    <ProtectedLayout>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up flex flex-wrap items-center justify-between gap-4">
          <div>
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Taxpayer Detail</p>
            <h1 className="font-display text-3xl text-foreground">{taxpayer.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{taxpayer.rra_id}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{taxpayer.type}</Badge>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs uppercase text-primary">
              Risk score {profile.score}
            </span>
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="fade-up border-border/60 bg-card/90 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Sector</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{getSectorLabel(taxpayer)}</p>
              </div>
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
          </Card>
          <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Income</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  ₦{(getIncomeValue(taxpayer) / 1000000).toFixed(1)}M
                </p>
              </div>
              <TrendingUp className="h-7 w-7 text-accent" />
            </div>
          </Card>
          <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "160ms" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Estimated Liability</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  ₦{(totalLiability / 1000000).toFixed(1)}M
                </p>
              </div>
              <FileText className="h-7 w-7 text-destructive" />
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <h2 className="text-lg font-semibold text-foreground">Risk Indicators</h2>
            <div className="mt-4 space-y-3">
              {profile.indicators.map((indicator) => (
                <div key={indicator.key} className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{indicator.label}</p>
                    <p className="text-xs text-muted-foreground">Weight {indicator.weight}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs uppercase ${
                      indicator.triggered ? "bg-accent/30 text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {indicator.triggered ? "Flagged" : "Clear"}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="text-lg font-semibold text-foreground">Tax Stream View</h2>
            <p className="mt-1 text-xs text-muted-foreground">VAT, CIT, Pensions, ADT snapshot</p>
            <div className="mt-4 space-y-3">
              {streamRows.map((stream) => (
                <div key={stream.label} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex items-center justify-between text-xs uppercase text-muted-foreground">
                    <span>{stream.label}</span>
                    <span>{stream.sector}</span>
                  </div>
                  <div className="mt-2 text-sm text-foreground">
                    {taxpayer.type === "CIT" ? taxpayer.company_name : taxpayer.name}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Income: ₦{(getIncomeValue(taxpayer) / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="fade-up rounded-2xl border border-border/60 bg-card/90 p-6" style={{ animationDelay: "180ms" }}>
          <h2 className="text-lg font-semibold text-foreground">Current Findings</h2>
          <div className="mt-4 space-y-3">
            {findings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No findings linked to this taxpayer yet.</p>
            ) : (
              findings.map((finding) => (
                <div key={finding.id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase text-muted-foreground">
                    <span>{finding.category}</span>
                    <span>{finding.risk_level} risk</span>
                    <span>{finding.status.replace("_", " ")}</span>
                  </div>
                  <p className="mt-2 text-sm text-foreground">{finding.description}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Estimated liability: ₦{(finding.estimated_tax_liability / 1000000).toFixed(1)}M
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </ProtectedLayout>
  )
}
