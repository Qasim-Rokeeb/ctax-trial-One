"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getSessionFromStorage } from "@/lib/session"
import { getAuditQueueForUser } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, TrendingUp, FileCheck } from "lucide-react"

export function AuditorQueue() {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-accent text-accent-foreground"
      case "low":
        return "bg-green-600 text-white"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-8">
        <h1 className="text-3xl font-bold mb-1">Audit Work Queue</h1>
        <p className="text-muted-foreground">{filtered.length} items to review</p>
      </div>

      {/* Filters */}
      <div className="border-b border-border p-6 space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Search by taxpayer name, RRA ID, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-input border-border"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "high", "medium", "low"] as const).map((risk) => (
            <Button
              key={risk}
              variant={filterRisk === risk ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterRisk(risk)}
              className={filterRisk === risk ? "bg-primary" : ""}
            >
              {risk === "all" ? "All" : `${risk.charAt(0).toUpperCase() + risk.slice(1)} Risk`}
            </Button>
          ))}
        </div>
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No items match your search</p>
            </div>
          ) : (
            filtered.map((item) => (
              <Card
                key={item.finding.id}
                className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/detail/${item.finding.taxpayer_id}`)}
              >
                <div className="p-6 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.taxpayer?.name}</h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${getRiskColor(item.finding.risk_level)}`}
                      >
                        {item.finding.risk_level.toUpperCase()} RISK
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.taxpayer?.rra_id}</p>
                    <p className="text-sm text-foreground mb-3">{item.finding.description}</p>
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileCheck className="w-4 h-4" />
                        <span>{item.finding.evidence_count} evidence files</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>₦{(item.finding.estimated_tax_liability / 1000000).toFixed(1)}M tax liability</span>
                      </div>
                    </div>
                  </div>
                  <Button className="ml-4 bg-primary hover:bg-primary/90">Review</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
