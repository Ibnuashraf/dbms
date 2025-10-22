import { getCurrentUserWithRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { Dumbbell, Apple, TrendingUp, User } from "lucide-react"

export default async function ClientDashboard() {
  const { user, role } = await getCurrentUserWithRole()

  // Middleware already checks authentication, just verify role
  if (role !== "client") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get client profile
  const { data: clientProfile } = await supabase.from("clients").select("*").eq("user_id", user.id).single()

  // Fetch assigned trainer
  const { data: trainer } = await supabase
    .from("trainers")
    .select("user:users(full_name, email, phone)")
    .eq("id", clientProfile?.assigned_trainer_id)
    .single()

  // Fetch workout plans
  const { count: workoutPlansCount } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("client_id", clientProfile?.id)

  // Fetch diet plans
  const { count: dietPlansCount } = await supabase
    .from("diet_plans")
    .select("*", { count: "exact", head: true })
    .eq("client_id", clientProfile?.id)

  // Fetch latest progress
  const { data: latestProgress } = await supabase
    .from("progress_tracking")
    .select("*")
    .eq("client_id", clientProfile?.id)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .single()

  const stats = [
    {
      title: "Current Weight",
      value: latestProgress?.weight ? `${latestProgress.weight} kg` : "N/A",
      icon: User,
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
      title: "Body Fat",
      value: latestProgress?.body_fat_percentage ? `${latestProgress.body_fat_percentage}%` : "N/A",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Fitness Dashboard</h1>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Trainer</CardTitle>
                <CardDescription>Your assigned fitness coach</CardDescription>
              </CardHeader>
              <CardContent>
                {trainer ? (
                  <div className="space-y-2">
                    <p className="font-semibold">{trainer.user?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{trainer.user?.email}</p>
                    <p className="text-sm text-muted-foreground">{trainer.user?.phone || "N/A"}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No trainer assigned yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership</CardTitle>
                <CardDescription>Your membership status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Status:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        clientProfile?.membership_status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {clientProfile?.membership_status}
                    </span>
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Joined:</span>{" "}
                    {new Date(clientProfile?.join_date).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your fitness information</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <a
                  href="/dashboard/client/workout-plans"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  View Workout Plans
                </a>
                <a
                  href="/dashboard/client/diet-plans"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  View Diet Plans
                </a>
                <a
                  href="/dashboard/client/progress"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  Track Progress
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
