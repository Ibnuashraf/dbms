"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Dumbbell, Apple, LogOut, MessageCircle } from "lucide-react"
import { signOut } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"

export function ClientSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/dashboard/client", label: "Overview", icon: BarChart3 },
    { href: "/dashboard/client/workout-plans", label: "Workout Plans", icon: Dumbbell },
    { href: "/dashboard/client/diet-plans", label: "Diet Plans", icon: Apple },
    { href: "/dashboard/client/progress", label: "Progress", icon: BarChart3 },
    { href: "/dashboard/client/chatbot", label: "Chatbot", icon: MessageCircle },
  ]

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-foreground">GymPro</h1>
        <p className="text-sm text-sidebar-foreground/60">Client Portal</p>
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
