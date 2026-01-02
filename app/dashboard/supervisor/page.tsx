"use client"

import { ProtectedLayout } from "@/components/layout/protected-layout"

export default function SupervisorDashboard() {
  return (
    <ProtectedLayout requiredRole="supervisor">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
        <p className="text-muted-foreground">Coming soon...</p>
      </div>
    </ProtectedLayout>
  )
}
