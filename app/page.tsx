"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSessionFromStorage } from "@/lib/session"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const session = getSessionFromStorage()
    if (session.isAuthenticated && session.user) {
      const destination = session.user.role === "auditor" ? "/mvp/queue" : "/mvp/dashboard"
      router.push(destination)
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
