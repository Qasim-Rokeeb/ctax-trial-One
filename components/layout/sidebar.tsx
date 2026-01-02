"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { clearSessionFromStorage } from "@/lib/session"
import { BarChart3, Users, TrendingUp, LogOut, Home } from "lucide-react"

interface SidebarProps {
  user: User
}

const MENU_ITEMS = {
  auditor: [{ label: "Work Queue", href: "/dashboard/auditor", icon: BarChart3 }],
  supervisor: [
    { label: "Overview", href: "/dashboard/supervisor", icon: Home },
    { label: "Team Performance", href: "/dashboard/supervisor/team", icon: Users },
  ],
  executive: [
    { label: "Dashboard", href: "/dashboard/executive", icon: TrendingUp },
    { label: "Reports", href: "/dashboard/executive/reports", icon: BarChart3 },
  ],
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = MENU_ITEMS[user.role] || []

  const handleLogout = () => {
    clearSessionFromStorage()
    router.push("/login")
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href={`/dashboard/${user.role}`} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold">CT</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">CTAX</h1>
            <p className="text-xs text-muted-foreground">Tax Compliance</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-sidebar-border">
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
