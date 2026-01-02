export interface TaxpayerBase {
  id: string
  rra_id: string
  name: string
  email: string
  phone: string
  address: string
  state: string
  registration_date: string
}

export interface CITTaxpayer extends TaxpayerBase {
  type: "CIT"
  company_name: string
  business_type: string
  registration_number: string
  employees_count: number
  annual_turnover: number
}

export interface PITTaxpayer extends TaxpayerBase {
  type: "PIT"
  occupation: string
  income_sources: string[]
  annual_income: number
}

export interface AuditFinding {
  id: string
  taxpayer_id: string
  category: string
  risk_level: "high" | "medium" | "low"
  description: string
  estimated_tax_liability: number
  evidence_count: number
  status: "open" | "in_review" | "resolved"
  created_date: string
  assigned_to: string
}

export interface Evidence {
  id: string
  finding_id: string
  type: "document" | "bank_statement" | "ledger" | "communication"
  description: string
  file_name: string
  upload_date: string
  url: string
}

export const MOCK_CIT_TAXPAYERS: CITTaxpayer[] = [
  {
    id: "tp-cit-001",
    rra_id: "CIT-2024-001234",
    name: "Ayo Oladele",
    company_name: "TechNova Solutions Ltd",
    email: "ayo@technova.ng",
    phone: "+234803111111",
    address: "45 Victoria Island Road",
    state: "Lagos",
    registration_date: "2020-03-15",
    business_type: "Software Development",
    registration_number: "RC/2020/3456789",
    employees_count: 45,
    annual_turnover: 250000000,
  },
  {
    id: "tp-cit-002",
    rra_id: "CIT-2024-001235",
    name: "Folake Oluwaseun",
    company_name: "Global Trade Imports Ltd",
    email: "folake@globaltrade.ng",
    phone: "+234803222222",
    address: "120 Lekki Expressway",
    state: "Lagos",
    registration_date: "2019-07-20",
    business_type: "Import/Export",
    registration_number: "RC/2019/7654321",
    employees_count: 78,
    annual_turnover: 850000000,
  },
  {
    id: "tp-cit-003",
    rra_id: "CIT-2024-001236",
    name: "Nnamdi Okonkwo",
    company_name: "Prime Manufacturing Ltd",
    email: "nnamdi@primemfg.ng",
    phone: "+234803333333",
    address: "78 Apapa Road",
    state: "Lagos",
    registration_date: "2018-11-05",
    business_type: "Manufacturing",
    registration_number: "RC/2018/5432109",
    employees_count: 120,
    annual_turnover: 1200000000,
  },
]

export const MOCK_PIT_TAXPAYERS: PITTaxpayer[] = [
  {
    id: "tp-pit-001",
    rra_id: "PIT-2024-002001",
    name: "Zainab Mohammed",
    email: "zainab@email.ng",
    phone: "+234803444444",
    address: "12 Ikoyi Road",
    state: "Lagos",
    registration_date: "2021-02-10",
    occupation: "Medical Doctor",
    income_sources: ["Private Practice", "Consulting"],
    annual_income: 45000000,
  },
  {
    id: "tp-pit-002",
    rra_id: "PIT-2024-002002",
    name: "Chukwu Ifeanyi",
    email: "chukwu@email.ng",
    phone: "+234803555555",
    address: "34 Awolowo Road",
    state: "Lagos",
    registration_date: "2020-06-15",
    occupation: "Business Consultant",
    income_sources: ["Consulting Fees", "Training", "Speaking Engagements"],
    annual_income: 32000000,
  },
]

export const MOCK_AUDIT_FINDINGS: AuditFinding[] = [
  {
    id: "finding-001",
    taxpayer_id: "tp-cit-001",
    category: "Income Underreporting",
    risk_level: "high",
    description:
      "Significant discrepancy between reported software licensing revenue and actual invoiced amounts. Bank statements show 35% higher income than declared.",
    estimated_tax_liability: 28500000,
    evidence_count: 8,
    status: "in_review",
    created_date: "2024-01-15",
    assigned_to: "user-auditor-1",
  },
  {
    id: "finding-002",
    taxpayer_id: "tp-cit-001",
    category: "Expense Overstatement",
    risk_level: "medium",
    description: "Some claimed consulting expenses appear to be personal in nature based on documentation review.",
    estimated_tax_liability: 4250000,
    evidence_count: 5,
    status: "open",
    created_date: "2024-01-20",
    assigned_to: "user-auditor-1",
  },
  {
    id: "finding-003",
    taxpayer_id: "tp-cit-002",
    category: "Transfer Pricing Concern",
    risk_level: "high",
    description:
      "Related party transactions at prices significantly different from arm's length values. International affiliate sales marked up 240%.",
    estimated_tax_liability: 95000000,
    evidence_count: 12,
    status: "open",
    created_date: "2024-01-10",
    assigned_to: "user-auditor-1",
  },
  {
    id: "finding-004",
    taxpayer_id: "tp-pit-001",
    category: "Unreported Income",
    risk_level: "high",
    description:
      "Medical practitioner reported only 65% of expected income based on clinic records and patient volume analysis.",
    estimated_tax_liability: 12750000,
    evidence_count: 6,
    status: "in_review",
    created_date: "2024-01-25",
    assigned_to: "user-auditor-1",
  },
]

export const MOCK_EVIDENCE: Evidence[] = [
  {
    id: "ev-001",
    finding_id: "finding-001",
    type: "bank_statement",
    description: "Q1 2024 Bank Statement - First National Bank",
    file_name: "FNB_Statement_Q1_2024.pdf",
    upload_date: "2024-01-15",
    url: "#",
  },
  {
    id: "ev-002",
    finding_id: "finding-001",
    type: "ledger",
    description: "Software License Revenue Ledger",
    file_name: "Revenue_Ledger_2024.xlsx",
    upload_date: "2024-01-16",
    url: "#",
  },
  {
    id: "ev-003",
    finding_id: "finding-001",
    type: "document",
    description: "Client Invoices - January to March 2024",
    file_name: "Client_Invoices_Q1_2024.pdf",
    upload_date: "2024-01-17",
    url: "#",
  },
  {
    id: "ev-004",
    finding_id: "finding-002",
    type: "document",
    description: "Consulting Expense Receipts",
    file_name: "Consulting_Receipts.pdf",
    upload_date: "2024-01-20",
    url: "#",
  },
  {
    id: "ev-005",
    finding_id: "finding-003",
    type: "document",
    description: "Transfer Pricing Analysis & Related Party Agreements",
    file_name: "Transfer_Pricing_Analysis.pdf",
    upload_date: "2024-01-12",
    url: "#",
  },
]

export function getAllTaxpayers() {
  return [
    ...MOCK_CIT_TAXPAYERS.map((tp) => ({ ...tp, type: "CIT" as const })),
    ...MOCK_PIT_TAXPAYERS.map((tp) => ({ ...tp, type: "PIT" as const })),
  ]
}

export function getTaxpayerById(id: string) {
  return getAllTaxpayers().find((tp) => tp.id === id)
}

export function getFindingsByTaxpayer(taxpayerId: string) {
  return MOCK_AUDIT_FINDINGS.filter((f) => f.taxpayer_id === taxpayerId)
}

export function getEvidenceByFinding(findingId: string) {
  return MOCK_EVIDENCE.filter((e) => e.finding_id === findingId)
}

export function getAuditQueueForUser(userId: string) {
  const findings = MOCK_AUDIT_FINDINGS.filter((f) => f.assigned_to === userId)
  return findings
    .map((finding) => {
      const taxpayer = getTaxpayerById(finding.taxpayer_id)
      return { finding, taxpayer }
    })
    .sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 }
      return riskOrder[a.finding.risk_level] - riskOrder[b.finding.risk_level]
    })
}
