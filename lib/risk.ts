import { getFindingsByTaxpayer, type CITTaxpayer, type PITTaxpayer } from "@/lib/mock-data"

export type RiskLevel = "high" | "medium" | "low"

export interface RiskIndicator {
  key: "late_filing" | "income_discrepancy"
  label: string
  weight: number
  triggered: boolean
}

export interface RiskProfile {
  score: number
  level: RiskLevel
  indicators: RiskIndicator[]
  totalLiability: number
  findingsCount: number
}

function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "high"
  if (score >= 45) return "medium"
  return "low"
}

export function getRiskProfile(taxpayer: CITTaxpayer | PITTaxpayer): RiskProfile {
  const findings = getFindingsByTaxpayer(taxpayer.id)
  const totalLiability = findings.reduce((sum, finding) => sum + finding.estimated_tax_liability, 0)

  const incomeDiscrepancy = findings.some((finding) =>
    /income|underreport|unreported/i.test(finding.category + finding.description),
  )

  const registrationMonth = new Date(taxpayer.registration_date).getMonth()
  const lateFiling = registrationMonth >= 6

  const indicators: RiskIndicator[] = [
    {
      key: "late_filing",
      label: "Late filing flag",
      weight: 45,
      triggered: lateFiling,
    },
    {
      key: "income_discrepancy",
      label: "Income discrepancy flag",
      weight: 55,
      triggered: incomeDiscrepancy,
    },
  ]

  const score = indicators.reduce((sum, indicator) => (indicator.triggered ? sum + indicator.weight : sum), 0)

  return {
    score,
    level: getRiskLevel(score),
    indicators,
    totalLiability,
    findingsCount: findings.length,
  }
}

export function getSectorLabel(taxpayer: CITTaxpayer | PITTaxpayer) {
  return taxpayer.type === "CIT" ? taxpayer.business_type : taxpayer.occupation
}

export function getIncomeValue(taxpayer: CITTaxpayer | PITTaxpayer) {
  return taxpayer.type === "CIT" ? taxpayer.annual_turnover : taxpayer.annual_income
}
