import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function ClientWorkoutPlansPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "client") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get client profile
  const { data: clientProfile } = await supabase.from("clients").select("*").eq("user_id", user.id).single()

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
      workout_exercises(id, exercise_name, sets, reps, weight, duration_minutes)
    `,
    )
    .eq("client_id", clientProfile?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">My Workout Plans</h1>

          <div className="space-y-6">
            {workoutPlans?.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.plan_name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge>{plan.difficulty_level}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Duration</p>
                      <p className="text-sm text-muted-foreground">{plan.duration_weeks} weeks</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Created</p>
                      <p className="text-sm text-muted-foreground">{new Date(plan.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {plan.workout_exercises && plan.workout_exercises.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Exercises</p>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Exercise</TableHead>
                              <TableHead>Sets</TableHead>
                              <TableHead>Reps</TableHead>
                              <TableHead>Weight</TableHead>
                              <TableHead>Duration</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {plan.workout_exercises.map((exercise: any) => (
                              <TableRow key={exercise.id}>
                                <TableCell>{exercise.exercise_name}</TableCell>
                                <TableCell>{exercise.sets}</TableCell>
                                <TableCell>{exercise.reps}</TableCell>
                                <TableCell>{exercise.weight ? `${exercise.weight} kg` : "N/A"}</TableCell>
                                <TableCell>
                                  {exercise.duration_minutes ? `${exercise.duration_minutes} min` : "N/A"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
