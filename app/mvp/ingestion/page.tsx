"use client"

import { useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileUp, CheckCircle2, AlertTriangle, CircleX, CircleCheckBig } from "lucide-react"
import { exportToCSV } from "@/lib/csv-export"
import {
  getRequiredIngestionFields,
  parseCsvContent,
  validateParsedCsv,
  type IngestionValidationSummary,
} from "@/lib/ingestion-validation"

export default function IngestionPage() {
  const [fileName, setFileName] = useState("")
  const [validation, setValidation] = useState<IngestionValidationSummary | null>(null)

  const requiredFields = useMemo(() => getRequiredIngestionFields(), [])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileName(file?.name ?? "")

    if (!file) {
      setValidation(null)
      return
    }

    const content = await file.text()
    const parsed = parseCsvContent(content)
    const summary = validateParsedCsv(parsed)
    setValidation(summary)
  }

  const handleExportIssues = () => {
    if (!validation || validation.issues.length === 0) return

    exportToCSV(
      validation.issues.map((issue) => ({
        row: issue.row,
        column: issue.column,
        severity: issue.severity,
        message: issue.message,
      })),
      `ingestion-validation-report-${new Date().toISOString().split("T")[0]}`,
    )
  }

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
                  onChange={handleFileChange}
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Selected file</p>
                <p className="mt-2 text-sm text-foreground">{fileName || "No file selected"}</p>
                <Button className="mt-4 bg-primary text-primary-foreground" disabled={!validation || validation.readiness === "blocked"}>
                  Validate and ingest
                </Button>
                {validation ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Validation status: <span className="font-semibold text-foreground">{validation.readiness.replace("_", " ")}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="fade-up border-border/60 bg-card/90 p-6" style={{ animationDelay: "120ms" }}>
            <h2 className="text-lg font-semibold text-foreground">Required Fields</h2>
            <p className="mt-1 text-xs text-muted-foreground">Schema + row-level checks.</p>
            <div className="mt-4 space-y-3">
              {requiredFields.map((field) => (
                <div key={field} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 p-3">
                  <span className="text-sm text-foreground">{field}</span>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="fade-up grid gap-4 lg:grid-cols-4" style={{ animationDelay: "180ms" }}>
          <Card className="border-border/60 bg-card/90 p-5">
            <p className="text-xs uppercase text-muted-foreground">Rows</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{validation?.rowCount ?? 0}</p>
          </Card>
          <Card className="border-border/60 bg-card/90 p-5">
            <p className="text-xs uppercase text-muted-foreground">Errors</p>
            <p className="mt-2 text-3xl font-semibold text-destructive">{validation?.errors ?? 0}</p>
          </Card>
          <Card className="border-border/60 bg-card/90 p-5">
            <p className="text-xs uppercase text-muted-foreground">Warnings</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{validation?.warnings ?? 0}</p>
          </Card>
          <Card className="border-border/60 bg-card/90 p-5">
            <p className="text-xs uppercase text-muted-foreground">Completeness</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{validation?.completenessScore ?? 0}%</p>
          </Card>
        </section>

        <section className="fade-up rounded-2xl border border-border/60 bg-card/90 p-6" style={{ animationDelay: "220ms" }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Validation Diagnostics</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Row-level issues, duplicate detection, and ingest readiness score.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportIssues} disabled={!validation || validation.issues.length === 0}>
                Export Issues CSV
              </Button>
              <span
                className={`rounded-full px-3 py-1 text-xs uppercase ${
                  validation?.readiness === "ready"
                    ? "bg-emerald-500/15 text-emerald-700"
                    : validation?.readiness === "needs_attention"
                      ? "bg-amber-500/15 text-amber-700"
                      : "bg-destructive/15 text-destructive"
                }`}
              >
                {validation ? validation.readiness.replace("_", " ") : "not validated"}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {!validation ? (
              <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                Upload a CSV file to run validation checks.
              </div>
            ) : validation.issues.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                <CircleCheckBig className="h-4 w-4" />
                No issues found. Dataset is ready for ingestion.
              </div>
            ) : (
              validation.issues.slice(0, 8).map((issue, index) => (
                <div key={`${issue.row}-${issue.column}-${index}`} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                  {issue.severity === "error" ? (
                    <CircleX className="mt-0.5 h-4 w-4 text-destructive" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" />
                  )}
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Row {issue.row}, column {issue.column}</p>
                    <p className="text-muted-foreground">{issue.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </ProtectedLayout>
  )
}
