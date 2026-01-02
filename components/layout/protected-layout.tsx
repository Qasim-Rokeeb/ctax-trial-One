"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"
import { getSessionFromStorage } from "@/lib/session"
import { Sidebar } from "./sidebar"

interface ProtectedLayoutProps {
  children: React.ReactNode
  requiredRole?: string
}

export function ProtectedLayout({ children, requiredRole }: ProtectedLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getSessionFromStorage()

    if (!session.isAuthenticated || !session.user) {
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
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
