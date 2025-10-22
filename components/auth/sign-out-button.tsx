"use client"

import { signOut } from "@/lib/auth-actions"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      // Clear client-side storage
      if (typeof window !== "undefined") {
        sessionStorage.clear()
        localStorage.clear()
      }
      
      // Sign out from server
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
      // Force redirect even if sign out fails
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login"
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      className="flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </Button>
  )
}
