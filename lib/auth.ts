export type UserRole = "auditor" | "supervisor" | "executive"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: Date
}

// Mock users for development
export const MOCK_USERS: Record<string, User & { password: string }> = {
  auditor1: {
    id: "user-auditor-1",
    email: "auditor@ctax.gov.ng",
    name: "Chioma Okafor",
    role: "auditor",
    department: "Field Audit",
    password: "demo123",
  },
  supervisor1: {
    id: "user-supervisor-1",
    email: "supervisor@ctax.gov.ng",
    name: "Emeka Okonkwo",
    role: "supervisor",
    department: "Audit Supervision",
    password: "demo123",
  },
  executive1: {
    id: "user-executive-1",
    email: "executive@ctax.gov.ng",
    name: "Dr. Folake Adeyemi",
    role: "executive",
    department: "Executive Office",
    password: "demo123",
  },
}

export function validateLogin(email: string, password: string): User | null {
  const user = Object.values(MOCK_USERS).find((u) => u.email === email)
  if (user && user.password === password) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export function getUserFromEmail(email: string): User | null {
  const user = Object.values(MOCK_USERS).find((u) => u.email === email)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}
