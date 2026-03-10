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
      const destination = user.role === "auditor" ? "/mvp/queue" : "/mvp/dashboard"
      router.push(destination)
    } else {
      setError("Invalid email or password. Try: auditor@ctax.gov.ng or executive@ctax.gov.ng / demo123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_20%,rgba(16,153,165,0.18),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(255,193,64,0.22),transparent_40%)] p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl grid-cols-1 gap-8 overflow-hidden rounded-[28px] border border-border/60 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative flex flex-col justify-between border-b border-border/60 p-8 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 hero-shimmer bg-[linear-gradient(120deg,rgba(16,153,165,0.08),rgba(255,193,64,0.12),rgba(16,153,165,0.08))]" />
          <div className="relative space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">
              One-month MVP
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div>
                  <h1 className="text-4xl font-semibold tracking-[0.08em] text-foreground">CTAX</h1>
                  <p className="text-sm text-muted-foreground">Compliance Studio</p>
                </div>
              </div>
              <p className="max-w-md text-lg text-foreground">
                Prove audit readiness in 30 days. Ship the leanest risk profiling pipeline with confidence.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Role-based access for Admin and Auditor",
                "CSV ingestion with required-field validation",
                "Risk scoring with two core indicators",
                "List, detail, and export-ready reporting",
              ].map((item) => (
                <div key={item} className="fade-up rounded-2xl border border-border/60 bg-background/70 p-4 text-sm">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative mt-10 flex items-center justify-between text-xs text-muted-foreground">
            <span>Built for RRA pilot teams</span>
            <span>Feb 2026 release</span>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8">
          <Card className="border-border/60 bg-background/90 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>Pick your role to explore the MVP workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? "Signing in..." : "Enter workspace"}
                </Button>
              </form>

              <div className="mt-6 space-y-3 rounded-2xl border border-dashed border-border/70 bg-muted/40 p-4 text-xs">
                <p className="text-muted-foreground">Demo credentials</p>
                <div className="grid gap-2">
                  <div className="rounded-lg bg-background/80 px-3 py-2">auditor@ctax.gov.ng</div>
                  <div className="rounded-lg bg-background/80 px-3 py-2">supervisor@ctax.gov.ng</div>
                  <div className="rounded-lg bg-background/80 px-3 py-2">executive@ctax.gov.ng</div>
                </div>
                <p className="text-muted-foreground">Password: demo123</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
