import type { User } from "./auth"

const STORAGE_KEY = "ctax_session"

export interface SessionData {
  user: User | null
  isAuthenticated: boolean
}

export function getSessionFromStorage(): SessionData {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const { user } = JSON.parse(stored)
      return { user, isAuthenticated: !!user }
    }
  } catch (error) {
    console.error("Error reading session:", error)
  }

  return { user: null, isAuthenticated: false }
}

export function setSessionInStorage(user: User): void {
  if (typeof window === "undefined") return

  const sessionData: SessionData = {
    user,
    isAuthenticated: true,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData))
}

export function clearSessionFromStorage(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
