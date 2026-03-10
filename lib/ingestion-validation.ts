export interface ParsedCsvResult {
  headers: string[]
  rows: Record<string, string>[]
}

export interface ValidationIssue {
  row: number
  column: string
  severity: "error" | "warning"
  message: string
}

export interface IngestionValidationSummary {
  rowCount: number
  columnCount: number
  completenessScore: number
  duplicates: number
  errors: number
  warnings: number
  readiness: "ready" | "needs_attention" | "blocked"
  issues: ValidationIssue[]
}

const REQUIRED_FIELDS = ["rra_id", "name", "tax_type", "sector", "annual_income"]
const ALLOWED_TAX_TYPES = ["CIT", "PIT"]

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

export function parseCsvContent(content: string): ParsedCsvResult {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    return { headers: [], rows: [] }
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase())
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? ""
      return acc
    }, {})
  })

  return { headers, rows }
}

function getReadiness(errors: number, warnings: number): IngestionValidationSummary["readiness"] {
  if (errors > 0) return "blocked"
  if (warnings > 0) return "needs_attention"
  return "ready"
}

export function validateParsedCsv(parsed: ParsedCsvResult): IngestionValidationSummary {
  const issues: ValidationIssue[] = []

  const missingFields = REQUIRED_FIELDS.filter((field) => !parsed.headers.includes(field))
  missingFields.forEach((field) => {
    issues.push({
      row: 0,
      column: field,
      severity: "error",
      message: `Missing required column: ${field}`,
    })
  })

  const idTracker = new Set<string>()
  let duplicateCount = 0
  let nonEmptyCells = 0

  parsed.rows.forEach((row, rowIndex) => {
    REQUIRED_FIELDS.forEach((field) => {
      const value = (row[field] ?? "").trim()
      if (value.length > 0) {
        nonEmptyCells += 1
      } else {
        issues.push({
          row: rowIndex + 2,
          column: field,
          severity: "error",
          message: `${field} is required`,
        })
      }
    })

    const rraId = (row.rra_id ?? "").trim()
    if (rraId) {
      if (idTracker.has(rraId)) {
        duplicateCount += 1
        issues.push({
          row: rowIndex + 2,
          column: "rra_id",
          severity: "warning",
          message: `Duplicate RRA ID detected: ${rraId}`,
        })
      }
      idTracker.add(rraId)
    }

    const taxType = (row.tax_type ?? "").trim().toUpperCase()
    if (taxType && !ALLOWED_TAX_TYPES.includes(taxType)) {
      issues.push({
        row: rowIndex + 2,
        column: "tax_type",
        severity: "error",
        message: `Unsupported tax type: ${row.tax_type}. Expected CIT or PIT.`,
      })
    }

    const annualIncomeRaw = (row.annual_income ?? "").replace(/,/g, "").trim()
    const annualIncome = Number(annualIncomeRaw)
    if (annualIncomeRaw && (Number.isNaN(annualIncome) || annualIncome < 0)) {
      issues.push({
        row: rowIndex + 2,
        column: "annual_income",
        severity: "error",
        message: `Invalid annual income value: ${row.annual_income}`,
      })
    }
  })

  const expectedCells = parsed.rows.length * REQUIRED_FIELDS.length
  const completenessScore = expectedCells === 0 ? 0 : Math.round((nonEmptyCells / expectedCells) * 100)
  const errors = issues.filter((issue) => issue.severity === "error").length
  const warnings = issues.length - errors

  return {
    rowCount: parsed.rows.length,
    columnCount: parsed.headers.length,
    completenessScore,
    duplicates: duplicateCount,
    errors,
    warnings,
    readiness: getReadiness(errors, warnings),
    issues,
  }
}

export function validateCsvContent(content: string): IngestionValidationSummary {
  const parsed = parseCsvContent(content)
  return validateParsedCsv(parsed)
}

export function getRequiredIngestionFields() {
  return [...REQUIRED_FIELDS]
}
