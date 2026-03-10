import { getAllTaxpayers, type CITTaxpayer, type PITTaxpayer } from "@/lib/mock-data"
import { getFindingsByTaxpayer } from "@/lib/mock-data"

export type RiskLevel = "high" | "medium" | "low"

export interface ScenarioConfig {
  lateFilingWeight: number
  incomeDiscrepancyWeight: number
  highThreshold: number
  mediumThreshold: number
}

export interface ScenarioProfile {
  taxpayerId: string
  taxpayerName: string
  baselineScore: number
  scenarioScore: number
  baselineLevel: RiskLevel
  scenarioLevel: RiskLevel
  delta: number
  liability: number
}

export interface ScenarioSummary {
  averageBaselineScore: number
  averageScenarioScore: number
  highRiskBaseline: number
  highRiskScenario: number
  totalLiability: number
  profiles: ScenarioProfile[]
}

export const DEFAULT_SCENARIO_CONFIG: ScenarioConfig = {
  lateFilingWeight: 45,
  incomeDiscrepancyWeight: 55,
  highThreshold: 80,
  mediumThreshold: 45,
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function sanitizeScenarioConfig(config: Partial<ScenarioConfig>): ScenarioConfig {
  const lateFilingWeight = clamp(config.lateFilingWeight ?? DEFAULT_SCENARIO_CONFIG.lateFilingWeight, 0, 100)
  const incomeDiscrepancyWeight = clamp(
    config.incomeDiscrepancyWeight ?? DEFAULT_SCENARIO_CONFIG.incomeDiscrepancyWeight,
    0,
    100,
  )

  const mediumThresholdRaw = clamp(config.mediumThreshold ?? DEFAULT_SCENARIO_CONFIG.mediumThreshold, 0, 100)
  const highThresholdRaw = clamp(config.highThreshold ?? DEFAULT_SCENARIO_CONFIG.highThreshold, 0, 100)

  const mediumThreshold = Math.min(mediumThresholdRaw, highThresholdRaw)
  const highThreshold = Math.max(highThresholdRaw, mediumThreshold)

  return {
    lateFilingWeight,
    incomeDiscrepancyWeight,
    mediumThreshold,
    highThreshold,
  }
}

function getLevel(score: number, config: ScenarioConfig): RiskLevel {
  if (score >= config.highThreshold) return "high"
  if (score >= config.mediumThreshold) return "medium"
  return "low"
}

function computeSignals(taxpayer: CITTaxpayer | PITTaxpayer) {
  const findings = getFindingsByTaxpayer(taxpayer.id)
  const incomeDiscrepancy = findings.some((finding) =>
    /income|underreport|unreported/i.test(finding.category + finding.description),
  )
  const registrationMonth = new Date(taxpayer.registration_date).getMonth()
  const lateFiling = registrationMonth >= 6
  const liability = findings.reduce((sum, finding) => sum + finding.estimated_tax_liability, 0)

  return { incomeDiscrepancy, lateFiling, liability }
}

function computeScore(signals: ReturnType<typeof computeSignals>, config: ScenarioConfig) {
  let score = 0
  if (signals.lateFiling) score += config.lateFilingWeight
  if (signals.incomeDiscrepancy) score += config.incomeDiscrepancyWeight
  return clamp(score, 0, 100)
}

export function runRiskScenario(configInput: Partial<ScenarioConfig>): ScenarioSummary {
  const config = sanitizeScenarioConfig(configInput)
  const taxpayers = getAllTaxpayers()

  const profiles = taxpayers.map((taxpayer) => {
    const signals = computeSignals(taxpayer)
    const baselineScore = computeScore(signals, DEFAULT_SCENARIO_CONFIG)
    const scenarioScore = computeScore(signals, config)

    return {
      taxpayerId: taxpayer.id,
      taxpayerName: taxpayer.type === "CIT" ? taxpayer.company_name : taxpayer.name,
      baselineScore,
      scenarioScore,
      baselineLevel: getLevel(baselineScore, DEFAULT_SCENARIO_CONFIG),
      scenarioLevel: getLevel(scenarioScore, config),
      delta: scenarioScore - baselineScore,
      liability: signals.liability,
    }
  })

  const totals = profiles.reduce(
    (acc, profile) => {
      acc.baselineScore += profile.baselineScore
      acc.scenarioScore += profile.scenarioScore
      acc.highRiskBaseline += profile.baselineLevel === "high" ? 1 : 0
      acc.highRiskScenario += profile.scenarioLevel === "high" ? 1 : 0
      acc.totalLiability += profile.liability
      return acc
    },
    { baselineScore: 0, scenarioScore: 0, highRiskBaseline: 0, highRiskScenario: 0, totalLiability: 0 },
  )

  return {
    averageBaselineScore: totals.baselineScore / Math.max(profiles.length, 1),
    averageScenarioScore: totals.scenarioScore / Math.max(profiles.length, 1),
    highRiskBaseline: totals.highRiskBaseline,
    highRiskScenario: totals.highRiskScenario,
    totalLiability: totals.totalLiability,
    profiles: profiles.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)),
  }
}

export function toScenarioQuery(configInput: Partial<ScenarioConfig>) {
  const config = sanitizeScenarioConfig(configInput)
  const params = new URLSearchParams()
  params.set("late", String(config.lateFilingWeight))
  params.set("income", String(config.incomeDiscrepancyWeight))
  params.set("high", String(config.highThreshold))
  params.set("medium", String(config.mediumThreshold))
  return params.toString()
}

export function fromScenarioQuery(searchParams: URLSearchParams): ScenarioConfig {
  return sanitizeScenarioConfig({
    lateFilingWeight: Number(searchParams.get("late")),
    incomeDiscrepancyWeight: Number(searchParams.get("income")),
    highThreshold: Number(searchParams.get("high")),
    mediumThreshold: Number(searchParams.get("medium")),
  })
}
