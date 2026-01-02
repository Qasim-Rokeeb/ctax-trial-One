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
import { ArrowLeft } from "lucide-react"

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

  return (
    <ProtectedLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-8">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <TaxpayerHeader taxpayer={taxpayer} />
        </div>

        {/* Summary Stats */}
        <div className="border-b border-border p-8">
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-card border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">RRA ID</p>
              <p className="text-lg font-semibold text-foreground">{taxpayer.rra_id}</p>
            </Card>
            <Card className="bg-card border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Registered</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date(taxpayer.registration_date).toLocaleDateString()}
              </p>
            </Card>
            <Card className="bg-card border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Active Findings</p>
              <p className="text-lg font-semibold text-foreground">{findings.length}</p>
            </Card>
            <Card className="bg-card border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Tax Liability</p>
              <p className="text-lg font-semibold text-accent">₦{(totalTaxLiability / 1000000).toFixed(1)}M</p>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-secondary border-border">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="findings">Findings ({findings.length})</TabsTrigger>
              <TabsTrigger value="information">Taxpayer Information</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Risk Summary</h2>
                <Card className="bg-card border-border p-6">
                  <div className="space-y-4">
                    {findings.length === 0 ? (
                      <p className="text-muted-foreground">No audit findings at this time.</p>
                    ) : (
                      findings.slice(0, 3).map((finding) => (
                        <div key={finding.id} className="pb-4 border-b border-border last:border-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{finding.category}</h4>
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
                          <p className="text-sm font-medium text-accent">
                            Estimated Liability: ₦{(finding.estimated_tax_liability / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Findings Tab */}
            <TabsContent value="findings" className="mt-6">
              <FindingsList findings={findings} />
            </TabsContent>

            {/* Taxpayer Info Tab */}
            <TabsContent value="information" className="mt-6">
              <TaxpayerInfo taxpayer={taxpayer} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedLayout>
  )
}
