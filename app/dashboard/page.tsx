import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user) {
    redirect("/auth/login")
  }

  // Redirect to role-specific dashboard
  if (role === "admin") {
    redirect("/dashboard/admin")
  } else if (role === "trainer") {
    redirect("/dashboard/trainer")
  } else if (role === "client") {
    redirect("/dashboard/client")
  }

  redirect("/auth/login")
}
