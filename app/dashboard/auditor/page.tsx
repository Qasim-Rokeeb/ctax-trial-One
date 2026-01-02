"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { AuditorQueue } from "@/components/auditor/queue"

export default function AuditorDashboard() {
  return (
    <ProtectedLayout requiredRole="auditor">
      <AuditorQueue />
    </ProtectedLayout>
  )
}
