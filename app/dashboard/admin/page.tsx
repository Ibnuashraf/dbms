import { getCurrentUserWithRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Users, Dumbbell, CreditCard, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const { user, role } = await getCurrentUserWithRole()

  // Middleware already checks authentication, just verify role
  if (role !== "admin") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Fetch statistics
  const { count: membersCount } = await supabase.from("clients").select("*", { count: "exact", head: true })

  const { count: trainersCount } = await supabase.from("trainers").select("*", { count: "exact", head: true })

  const { data: recentPayments } = await supabase
    .from("payments")
    .select("amount")
    .order("created_at", { ascending: false })
    .limit(10)

  const totalRevenue = recentPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  const stats = [
    {
      title: "Total Members",
      value: membersCount || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Trainers",
      value: trainersCount || 0,
      icon: Dumbbell,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: CreditCard,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Growth",
      value: "+12%",
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.full_name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your gym operations</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <a
                  href="/dashboard/admin/members"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Manage Members
                </a>
                <a
                  href="/dashboard/admin/trainers"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Manage Trainers
                </a>
                <a
                  href="/dashboard/admin/payments"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  View Payments
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
