"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"

export default function ReportsPage() {
  const riskData = [
    { taxpayer: "Ayo Oladele", rra_id: "CIT-2024-001234", type: "CIT", score: 55, level: "medium" },
    { taxpayer: "Folake Oluwaseum", rra_id: "CIT-2024-001235", type: "CIT", score: 45, level: "medium" },
    { taxpayer: "Nnamdi Okonkwo", rra_id: "CIT-2024-001236", type: "CIT", score: 45, level: "medium" },
    { taxpayer: "Zainab Mohammed", rra_id: "PIT-2024-002001", type: "PIT", score: 55, level: "medium" },
    { taxpayer: "Chukwu Ifeanyi", rra_id: "PIT-2024-002002", type: "PIT", score: 0, level: "low" },
  ]

  const handleExportCSV = () => {
    exportToCSV(riskData, `risk-table-export-${new Date().toISOString().split('T')[0]}`)
  }

  return (
    <ProtectedLayout allowedRoles={["executive", "supervisor"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <div className="flex items-center justify-between">
          <header>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">REPORTING</p>
            <h1 className="font-display text-3xl text-foreground">Export Risk Table</h1>
            <p className="mt-2 text-sm text-muted-foreground">Generate a CSV for taxpayers and risk scores.</p>
          </header>
          
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card className="border-border/60 bg-card/90 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Taxpayer</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">RRA ID</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Score</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Level</th>
                </tr>
              </thead>
              <tbody>
                {riskData.map((row, index) => (
                  <tr key={row.rra_id} className="border-b border-border/20 hover:bg-accent/5 transition-colors">
                    <td className="py-4 px-4 text-sm text-foreground">{row.taxpayer}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{row.rra_id}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{row.type}</td>
                    <td className="py-4 px-4 text-sm text-foreground font-medium">{row.score}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        row.level === "medium" 
                          ? "bg-yellow-500/10 text-yellow-600" 
                          : "bg-green-500/10 text-green-600"
                      }`}>
                        {row.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
