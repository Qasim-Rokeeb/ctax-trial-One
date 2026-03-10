"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_SCENARIO_CONFIG,
  fromScenarioQuery,
  runRiskScenario,
  sanitizeScenarioConfig,
  toScenarioQuery,
  type ScenarioConfig,
} from "@/lib/risk-simulation"

function FieldRow({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (next: number) => void
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
    </label>
  )
}

export function RiskLabClient() {
  const searchParams = useSearchParams()

  const initialConfig = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    return fromScenarioQuery(params)
  }, [searchParams])

  const [config, setConfig] = useState<ScenarioConfig>(initialConfig)

  const scenario = useMemo(() => runRiskScenario(config), [config])

  const shareLink = useMemo(() => {
    const query = toScenarioQuery(config)
    return `${typeof window !== "undefined" ? window.location.origin : ""}/mvp/lab?${query}`
  }, [config])

  const resetToDefault = () => setConfig(DEFAULT_SCENARIO_CONFIG)

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareLink)
  }

  return (
    <ProtectedLayout allowedRoles={["executive", "supervisor"]}>
      <div className="flex h-full flex-col gap-6 p-8">
        <header className="fade-up flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Decision Intelligence</p>
            <h1 className="font-display text-3xl text-foreground">Risk Scenario Lab</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Tune risk weights and thresholds, then inspect how classification shifts across the current portfolio.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetToDefault}>
              Reset to default
            </Button>
            <Button onClick={copyShareLink}>Copy scenario link</Button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="fade-up border-border/60 bg-card/90 p-6">
            <h2 className="text-lg font-semibold text-foreground">Model Controls</h2>
            <p className="mt-1 text-xs text-muted-foreground">Adjust weights and thresholds used in risk scoring.</p>
            <div className="mt-5 space-y-5">
              <FieldRow
                label="Late filing weight"
                value={config.lateFilingWeight}
                min={0}
                max={100}
                onChange={(lateFilingWeight) => setConfig((prev) => sanitizeScenarioConfig({ ...prev, lateFilingWeight }))}
              />
              <FieldRow
                label="Income discrepancy weight"
                value={config.incomeDiscrepancyWeight}
                min={0}
                max={100}
                onChange={(incomeDiscrepancyWeight) =>
                  setConfig((prev) => sanitizeScenarioConfig({ ...prev, incomeDiscrepancyWeight }))
                }
              />
              <FieldRow
                label="Medium risk threshold"
                value={config.mediumThreshold}
                min={0}
                max={100}
                onChange={(mediumThreshold) => setConfig((prev) => sanitizeScenarioConfig({ ...prev, mediumThreshold }))}
              />
              <FieldRow
                label="High risk threshold"
                value={config.highThreshold}
                min={0}
                max={100}
                onChange={(highThreshold) => setConfig((prev) => sanitizeScenarioConfig({ ...prev, highThreshold }))}
              />
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
            <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "80ms" }}>
              <p className="text-xs uppercase text-muted-foreground">Average Score Shift</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {(scenario.averageScenarioScore - scenario.averageBaselineScore) >= 0 ? "+" : ""}
                {(scenario.averageScenarioScore - scenario.averageBaselineScore).toFixed(1)}
              </p>
            </Card>
            <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "140ms" }}>
              <p className="text-xs uppercase text-muted-foreground">High-Risk Taxpayers</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {scenario.highRiskScenario}
                <span className="ml-2 text-base text-muted-foreground">vs {scenario.highRiskBaseline} baseline</span>
              </p>
            </Card>
            <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "200ms" }}>
              <p className="text-xs uppercase text-muted-foreground">Portfolio Exposure</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">₦{(scenario.totalLiability / 1000000).toFixed(1)}M</p>
            </Card>
            <Card className="fade-up border-border/60 bg-card/90 p-5" style={{ animationDelay: "260ms" }}>
              <p className="text-xs uppercase text-muted-foreground">Scenario Version</p>
              <p className="mt-2 text-sm text-foreground break-all">{toScenarioQuery(config)}</p>
            </Card>
          </div>
        </section>

        <section className="fade-up rounded-2xl border border-border/60 bg-card/90 p-6" style={{ animationDelay: "280ms" }}>
          <h2 className="text-lg font-semibold text-foreground">Taxpayer Impact Table</h2>
          <p className="mt-1 text-xs text-muted-foreground">Sorted by highest absolute score movement.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  <th className="px-3 py-3">Taxpayer</th>
                  <th className="px-3 py-3">Baseline</th>
                  <th className="px-3 py-3">Scenario</th>
                  <th className="px-3 py-3">Delta</th>
                  <th className="px-3 py-3">Priority shift</th>
                </tr>
              </thead>
              <tbody>
                {scenario.profiles.map((profile) => (
                  <tr key={profile.taxpayerId} className="border-b border-border/20 text-sm">
                    <td className="px-3 py-3 text-foreground">{profile.taxpayerName}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {profile.baselineScore} ({profile.baselineLevel})
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {profile.scenarioScore} ({profile.scenarioLevel})
                    </td>
                    <td className="px-3 py-3 text-foreground">
                      {profile.delta >= 0 ? "+" : ""}
                      {profile.delta}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {profile.baselineLevel === profile.scenarioLevel
                        ? "No change"
                        : `${profile.baselineLevel} -> ${profile.scenarioLevel}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ProtectedLayout>
  )
}
