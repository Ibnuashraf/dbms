"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Dumbbell, CreditCard, LogOut } from "lucide-react"
import { signOut } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/dashboard/admin", label: "Overview", icon: Dumbbell },
    { href: "/dashboard/admin/members", label: "Members", icon: Users },
    { href: "/dashboard/admin/trainers", label: "Trainers", icon: Users },
    { href: "/dashboard/admin/payments", label: "Payments", icon: CreditCard },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">GymPro</h1>
        <p className="text-sm text-sidebar-foreground/60">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "default" : "ghost"} className="w-full justify-start gap-2">
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <form action={signOut}>
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  )
}
