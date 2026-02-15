export const CIT_META = {
  policy_version: "CIT-2025.12.22",
  computation_timestamp: "2025-12-22T09:40:00Z",
}

export const CIT_DEMO_COMPANY_ID = "tp-cit-001"
export const CIT_DEMO_CASE_ID = "case-ct-1024"

export const EXECUTIVE_OVERVIEW = {
  ...CIT_META,
  riskHistogram: {
    bins: ["0-20", "21-40", "41-60", "61-80", "81-100"],
    counts: [14, 9, 6, 4, 2],
    thresholds: [20, 40, 60, 80],
  },
  sectorHeatmap: {
    sectors: [
      { sector: "Manufacturing", size: 32, risk_count: 12, intensity: "high" },
      { sector: "Technology", size: 24, risk_count: 7, intensity: "medium" },
      { sector: "Trade", size: 19, risk_count: 5, intensity: "medium" },
      { sector: "Healthcare", size: 14, risk_count: 3, intensity: "low" },
      { sector: "Energy", size: 11, risk_count: 4, intensity: "medium" },
      { sector: "Logistics", size: 9, risk_count: 2, intensity: "low" },
    ],
  },
  revenueAtStake: {
    total: { label: "Total gap", value: "NGN 3.4B", unit: "NGN" },
    sum_gap_by_segment: [
      { segment: "Large taxpayers", value: "NGN 1.9B", unit: "NGN" },
      { segment: "Mid-market", value: "NGN 980M", unit: "NGN" },
      { segment: "Emerging", value: "NGN 520M", unit: "NGN" },
    ],
  },
}

export const SUPERVISOR_QUEUE = {
  ...CIT_META,
  paging: {
    page: 1,
    page_size: 6,
    total_pages: 3,
  },
  companies: [
    {
      company_id: "tp-cit-001",
      name: "TechNova Solutions Ltd",
      rc: "RC/2020/3456789",
      tin: "TIN-CT-439201",
      risk_score: 82,
      drivers: ["Gap persistence", "Income mismatch", "Peer deviation"],
    },
    {
      company_id: "tp-cit-002",
      name: "Global Trade Imports Ltd",
      rc: "RC/2019/7654321",
      tin: "TIN-CT-110287",
      risk_score: 73,
      drivers: ["Cashflow variance", "FX exposure"],
    },
    {
      company_id: "tp-cit-003",
      name: "Prime Manufacturing Ltd",
      rc: "RC/2018/5432109",
      tin: "TIN-CT-558310",
      risk_score: 69,
      drivers: ["Expense anomaly", "Peer deviation"],
    },
    {
      company_id: "tp-cit-004",
      name: "Crescent Power Holdings",
      rc: "RC/2017/3421189",
      tin: "TIN-CT-129455",
      risk_score: 64,
      drivers: ["Gap persistence", "Cashflow variance"],
    },
    {
      company_id: "tp-cit-005",
      name: "Harbor Logistics Group",
      rc: "RC/2016/8342219",
      tin: "TIN-CT-771882",
      risk_score: 58,
      drivers: ["Income mismatch"],
    },
    {
      company_id: "tp-cit-006",
      name: "Emerald Health Services",
      rc: "RC/2021/5530192",
      tin: "TIN-CT-903118",
      risk_score: 54,
      drivers: ["Peer deviation"],
    },
  ],
  driverPanel: {
    gap: "NGN 120M",
    persistence: "18 months",
    cashflow: "-NGN 42M",
    peer: "+2.1 sigma",
  },
  auditors: [
    { id: "aud-01", name: "Chioma Okafor" },
    { id: "aud-02", name: "Tunde Adebayo" },
    { id: "aud-03", name: "Kemi Ojo" },
  ],
}

export const COMPANY_INVESTIGATION = {
  ...CIT_META,
  company: {
    company_id: "tp-cit-001",
    name: "TechNova Solutions Ltd",
    rc: "RC/2020/3456789",
    tin: "TIN-CT-439201",
    case_id: "case-ct-1024",
    risk_score: 82,
  },
  taxTimeline: {
    cit: [
      { year: "2021", computed: 118, reported: 92, unit: "NGN million" },
      { year: "2022", computed: 134, reported: 101, unit: "NGN million" },
      { year: "2023", computed: 149, reported: 108, unit: "NGN million" },
      { year: "2024", computed: 162, reported: 116, unit: "NGN million" },
    ],
    vat: [
      { year: "2021", computed: 42, reported: 31, unit: "NGN million" },
      { year: "2022", computed: 48, reported: 36, unit: "NGN million" },
      { year: "2023", computed: 55, reported: 39, unit: "NGN million" },
      { year: "2024", computed: 63, reported: 44, unit: "NGN million" },
    ],
    edt: [
      { year: "2021", computed: 9, reported: 7, unit: "NGN million" },
      { year: "2022", computed: 11, reported: 8, unit: "NGN million" },
      { year: "2023", computed: 12, reported: 9, unit: "NGN million" },
      { year: "2024", computed: 14, reported: 10, unit: "NGN million" },
    ],
  },
  gapTable: [
    { year: "2021", gap: "NGN 26M", ratio: "22%", flag: "High" },
    { year: "2022", gap: "NGN 33M", ratio: "25%", flag: "High" },
    { year: "2023", gap: "NGN 41M", ratio: "28%", flag: "High" },
    { year: "2024", gap: "NGN 46M", ratio: "28%", flag: "High" },
  ],
  fxCashflow: [
    { year: "2021", inflow_ngn: 72, outflow_ngn: 58, fx_source: "USD licensing receipts" },
    { year: "2022", inflow_ngn: 84, outflow_ngn: 62, fx_source: "EUR services invoices" },
    { year: "2023", inflow_ngn: 93, outflow_ngn: 70, fx_source: "USD subscriptions" },
    { year: "2024", inflow_ngn: 101, outflow_ngn: 74, fx_source: "GBP support contracts" },
  ],
  peerBoxplot: {
    median: "NGN 118M",
    iqr_low: "NGN 92M",
    iqr_high: "NGN 141M",
    value: "NGN 162M",
    zscore: "+2.4",
  },
  explanation: {
    reason_text:
      "The company shows sustained gaps between computed and reported CIT across four years, with FX inflows concentrated in USD licensing that are not mirrored in declared revenue. Peer benchmarking places the firm above the 90th percentile for mismatch persistence.",
  },
}

export const LEGAL_PACK = {
  ...CIT_META,
  case_id: "case-ct-1024",
  exhibits: [
    { exhibit_type: "Revenue Reconciliation", data: "CIT-REV-2024-EXH-01" },
    { exhibit_type: "FX Cashflow Summary", data: "CIT-FX-2024-EXH-02" },
    { exhibit_type: "Peer Benchmark", data: "CIT-PEER-2024-EXH-03" },
  ],
  auditTrail: {
    events: [
      { id: "evt-01", timestamp: "2025-12-15T08:40:00Z", actor: "Risk Engine", action: "Case created" },
      { id: "evt-02", timestamp: "2025-12-16T10:12:00Z", actor: "Supervisor", action: "Assigned to auditor" },
      { id: "evt-03", timestamp: "2025-12-18T15:45:00Z", actor: "Auditor", action: "Evidence bundle uploaded" },
      { id: "evt-04", timestamp: "2025-12-20T11:05:00Z", actor: "Legal", action: "Legal pack generated" },
    ],
  },
}
