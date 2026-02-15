"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp, CheckCircle2 } from "lucide-react"

const REQUIRED_FIELDS = ["rra_id", "name", "tax_type", "sector", "annual_income"]

export default function IngestionPage() {
  const [fileName, setFileName] = useState("")

  return (
    <ProtectedLayout allowedRoles={["executive", "supervisor"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Data Ingestion</p>
          <h1 className="font-display text-3xl text-foreground">Upload Taxpayer CSV</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Minimal ingestion for the MVP. We only check required fields and surface a preview summary.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-6 text-center">
                <FileUp className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm text-foreground">Drag and drop your CSV file</p>
                <p className="mt-1 text-xs text-muted-foreground">Or click to browse (max 5MB)</p>
                <Input
                  type="file"
                  accept=".csv"
                  className="mt-4 cursor-pointer"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Selected file</p>
                <p className="mt-2 text-sm text-foreground">{fileName || "No file selected"}</p>
                <Button className="mt-4 bg-primary text-primary-foreground" disabled={!fileName}>
                  Validate & ingest
                </Button>
              </div>
            </div>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="text-lg font-semibold text-foreground">Required Fields</h2>
            <p className="mt-1 text-xs text-muted-foreground">Basic validation only.</p>
            <div className="mt-4 space-y-3">
              {REQUIRED_FIELDS.map((field) => (
                <div key={field} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 p-3">
                  <span className="text-sm text-foreground">{field}</span>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="fade-up rounded-2xl border border-border/60 bg-card/90 p-6" style={{ animationDelay: "200ms" }}>
          <h2 className="text-lg font-semibold text-foreground">Preview (first 5 rows)</h2>
          <div className="mt-4 grid gap-3">
            {[
              "CIT-2024-001234 | TechNova Solutions | CIT | Technology | 250,000,000",
              "CIT-2024-001235 | Global Trade Imports | VAT | Trade | 850,000,000",
              "PIT-2024-002001 | Zainab Mohammed | Pensions | Healthcare | 45,000,000",
              "PIT-2024-002002 | Chukwu Ifeanyi | ADT | Consulting | 32,000,000",
              "CIT-2024-001236 | Prime Manufacturing | CIT | Manufacturing | 1,200,000,000",
            ].map((row) => (
              <div key={row} className="rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-xs text-muted-foreground">
                {row}
              </div>
            ))}
          </div>
        </section>
      </div>
    </ProtectedLayout>
  )
}
