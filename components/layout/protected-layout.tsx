"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "@/lib/auth"
import { getSessionFromStorage } from "@/lib/session"
import { Sidebar } from "./sidebar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { CIT_META } from "@/lib/cit-data"

interface ProtectedLayoutProps {
  children: React.ReactNode
  requiredRole?: UserRole
  allowedRoles?: UserRole[]
}

export function ProtectedLayout({ children, requiredRole, allowedRoles }: ProtectedLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSessionFromStorage()

    if (!session.isAuthenticated || !session.user) {
      router.push("/login")
      return
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      router.push("/login")
      return
    }

    if (requiredRole && session.user.role !== requiredRole) {
      router.push("/login")
      return
    }

    setUser(session.user)
    setIsLoading(false)
  }, [router, requiredRole])

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-muted border-t-primary animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} />
      <main className="relative flex-1 overflow-auto">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,193,64,0.2),transparent_40%),radial-gradient(circle_at_20%_40%,rgba(16,153,165,0.14),transparent_45%)]" />
        <div className="relative min-h-full">
          <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
            <div className="flex flex-wrap items-center gap-4 px-6 py-4">
              <div className="min-w-35">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Role</p>
                <p className="text-sm font-semibold text-foreground capitalize">{user.role}</p>
              </div>
              <div className="flex-1 min-w-55">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search company name / RC / TIN / Case ID"
                    className="pl-9 bg-input border-border"
                  />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Policy {CIT_META.policy_version} · {CIT_META.computation_timestamp}
              </div>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  )
}
