import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { TrainerSidebar } from "@/components/trainer/trainer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default async function DietPlansPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "trainer") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get trainer profile
  const { data: trainerProfile } = await supabase.from("trainers").select("*").eq("user_id", user.id).single()

  // Fetch diet plans
  const { data: dietPlans } = await supabase
    .from("diet_plans")
    .select(
      `
      id,
      plan_name,
      description,
      daily_calories,
      protein_grams,
      carbs_grams,
      fat_grams,
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
            <h1 className="text-3xl font-bold">Diet Plans</h1>
            <Button>Create New Plan</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Diet Plans</CardTitle>
              <CardDescription>All nutrition plans created for your clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Daily Calories</TableHead>
                      <TableHead>Protein (g)</TableHead>
                      <TableHead>Carbs (g)</TableHead>
                      <TableHead>Fat (g)</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dietPlans?.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.plan_name}</TableCell>
                        <TableCell>{plan.client?.user?.full_name || "N/A"}</TableCell>
                        <TableCell>{plan.daily_calories}</TableCell>
                        <TableCell>{plan.protein_grams}</TableCell>
                        <TableCell>{plan.carbs_grams}</TableCell>
                        <TableCell>{plan.fat_grams}</TableCell>
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
