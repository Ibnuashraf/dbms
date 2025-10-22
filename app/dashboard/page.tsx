import { getCurrentUserWithRole } from "@/lib/auth-actions"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  // Since middleware already checks authentication, we only need to get the role
  const { role } = await getCurrentUserWithRole()

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
