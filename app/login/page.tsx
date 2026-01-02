"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateLogin } from "@/lib/auth"
import { setSessionInStorage } from "@/lib/session"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const user = validateLogin(email, password)

    if (user) {
      setSessionInStorage(user)
      await new Promise((resolve) => setTimeout(resolve, 300))
      router.push(`/dashboard/${user.role}`)
    } else {
      setError("Invalid email or password. Try: auditor@ctax.gov.ng / demo123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
            <span className="text-primary-foreground font-bold text-lg">CT</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">CTAX</h1>
          <p className="text-muted-foreground mt-2">Tax Compliance Platform</p>
        </div>

        {/* Login Card */}
        <Card className="bg-card border-border">
          <CardHeader className="space-y-1">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="auditor@ctax.gov.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-secondary p-2 rounded">
                  <p className="text-foreground font-mono">auditor@ctax.gov.ng</p>
                </div>
                <div className="bg-secondary p-2 rounded">
                  <p className="text-foreground font-mono">supervisor@ctax.gov.ng</p>
                </div>
                <div className="bg-secondary p-2 rounded">
                  <p className="text-foreground font-mono">executive@ctax.gov.ng</p>
                </div>
                <p className="text-muted-foreground">Password: demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
