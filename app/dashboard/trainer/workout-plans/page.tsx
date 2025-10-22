import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { TrainerSidebar } from "@/components/trainer/trainer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default async function WorkoutPlansPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "trainer") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get trainer profile
  const { data: trainerProfile } = await supabase.from("trainers").select("*").eq("user_id", user.id).single()

  // Fetch workout plans
  const { data: workoutPlans } = await supabase
    .from("workout_plans")
    .select(
      `
      id,
      plan_name,
      description,
      duration_weeks,
      difficulty_level,
      created_at,
      client:clients(user:users(full_name))
    `,
    )
    .eq("trainer_id", trainerProfile?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Workout Plans</h1>
            <Button>Create New Plan</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Workout Plans</CardTitle>
              <CardDescription>All workout plans created for your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workoutPlans?.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.plan_name}</TableCell>
                        <TableCell>{plan.client?.user?.full_name || "N/A"}</TableCell>
                        <TableCell>{plan.duration_weeks} weeks</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            {plan.difficulty_level}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(plan.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
