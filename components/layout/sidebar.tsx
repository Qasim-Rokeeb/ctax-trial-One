"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { clearSessionFromStorage } from "@/lib/session"
import { BarChart3, Users, TrendingUp, LogOut, FileUp, FileText, ShieldCheck, Scale } from "lucide-react"

interface SidebarProps {
  user: User
}

const AUDITOR_ITEMS = [
  { label: "Work Queue", href: "/mvp/queue", icon: BarChart3 },
  { label: "Taxpayers", href: "/mvp/taxpayers", icon: Users },
  { label: "CIT Cases", href: "/company", icon: ShieldCheck },
]

const ADMIN_ITEMS = [
  { label: "Dashboard", href: "/mvp/dashboard", icon: TrendingUp },
  { label: "Risk Lab", href: "/mvp/lab", icon: BarChart3 },
  { label: "Taxpayers", href: "/mvp/taxpayers", icon: Users },
  { label: "Ingestion", href: "/mvp/ingestion", icon: FileUp },
  { label: "Reports", href: "/mvp/reports", icon: FileText },
  { label: "CIT Overview", href: "/executive/overview", icon: ShieldCheck },
  { label: "Legal Packs", href: "/legal/pack", icon: Scale },
]

const SUPERVISOR_ITEMS = [
  { label: "Queue", href: "/supervisor/queue", icon: BarChart3 },
  { label: "CIT Cases", href: "/company", icon: ShieldCheck },
  { label: "Legal Packs", href: "/legal/pack", icon: Scale },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems =
    user.role === "auditor"
      ? AUDITOR_ITEMS
      : user.role === "supervisor"
        ? SUPERVISOR_ITEMS
        : ADMIN_ITEMS

  const isAdmin = user.role === "executive" || user.role === "supervisor"

  const handleLogout = () => {
    clearSessionFromStorage()
    router.push("/login")
  }

  return (
    <aside className="w-72 bg-sidebar text-sidebar-foreground h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <Link href={user.role === "auditor" ? "/mvp/queue" : user.role === "supervisor" ? "/supervisor/queue" : "/mvp/dashboard"} className="flex items-center">
          <div>
            <h1 className="text-lg font-semibold tracking-[0.08em]">CTAX</h1>
            <p className="text-xs text-sidebar-accent-foreground">Compliance Studio</p>
          </div>
        </Link>
      </div>

      <div className="px-6 py-4 border-b border-sidebar-border">
        <p className="text-sm font-medium">{user.name}</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-sidebar-accent px-3 py-1 text-xs uppercase tracking-[0.2em]">
          {user.role}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
