"use client"

import { useState } from "react"
import type { AuditFinding } from "@/lib/mock-data"
import { getEvidenceByFinding } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, AlertCircle } from "lucide-react"

interface FindingsListProps {
  findings: AuditFinding[]
}

export function FindingsList({ findings }: FindingsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (findings.length === 0) {
    return (
      <Card className="bg-card border-border p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No audit findings recorded for this taxpayer.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {findings.map((finding) => {
        const evidence = getEvidenceByFinding(finding.id)
        const isExpanded = expandedId === finding.id

        return (
          <Card key={finding.id} className="bg-card border-border">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{finding.category}</h3>
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
                  <p className="text-sm text-muted-foreground mb-3">{finding.description}</p>
                </div>
              </div>

              {/* Details Row */}
              <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Estimated Tax Liability</p>
                  <p className="font-semibold text-accent">
                    ₦{(finding.estimated_tax_liability / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-semibold text-foreground capitalize">{finding.status}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date Reported</p>
                  <p className="font-semibold text-foreground">{new Date(finding.created_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Evidence Section */}
              <Button
                variant="ghost"
                onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                className="w-full justify-between text-foreground hover:bg-secondary"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Evidence ({evidence.length})
                </span>
                <span className="text-xs">{isExpanded ? "Hide" : "Show"}</span>
              </Button>

              {isExpanded && evidence.length > 0 && (
                <div className="mt-4 space-y-2 pl-6 border-l-2 border-border">
                  {evidence.map((item) => (
                    <div key={item.id} className="py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground text-sm">{item.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.file_name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Uploaded {new Date(item.upload_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
