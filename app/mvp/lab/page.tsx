import { Suspense } from "react"
import { RiskLabClient } from "./risk-lab-client"

function RiskLabFallback() {
  return <div className="p-8 text-sm text-muted-foreground">Loading risk lab...</div>
}

export default function RiskLabPage() {
  return (
    <Suspense fallback={<RiskLabFallback />}>
      <RiskLabClient />
    </Suspense>
  )
}
