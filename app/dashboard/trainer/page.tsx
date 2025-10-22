import { getCurrentUserWithRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrainerSidebar } from "@/components/trainer/trainer-sidebar"
import { Users, Dumbbell, Apple, TrendingUp } from "lucide-react"

export default async function TrainerDashboard() {
  const { user, role } = await getCurrentUserWithRole()

  // Middleware already checks authentication, just verify role
  if (role !== "trainer") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get trainer profile
  const { data: trainerProfile } = await supabase.from("trainers").select("*").eq("user_id", user.id).single()

  // Fetch statistics
  const { count: clientsCount } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("assigned_trainer_id", trainerProfile?.id)

  const { count: workoutPlansCount } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", trainerProfile?.id)

  const { count: dietPlansCount } = await supabase
    .from("diet_plans")
    .select("*", { count: "exact", head: true })
    .eq("trainer_id", trainerProfile?.id)

  const stats = [
    {
      title: "Active Clients",
      value: clientsCount || 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Workout Plans",
      value: workoutPlansCount || 0,
      icon: Dumbbell,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Diet Plans",
      value: dietPlansCount || 0,
      icon: Apple,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Hourly Rate",
      value: `$${trainerProfile?.hourly_rate || 0}`,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Trainer Dashboard</h1>
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
                <CardDescription>Manage your training programs</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <a
                  href="/dashboard/trainer/clients"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  View Clients
                </a>
                <a
                  href="/dashboard/trainer/workout-plans"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Create Workout Plan
                </a>
                <a
                  href="/dashboard/trainer/diet-plans"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Create Diet Plan
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
