import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { TrainerSidebar } from "@/components/trainer/trainer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DietPlanDialog } from "@/components/trainer/diet-plan-dialog"
import { DietPlanActions } from "@/components/trainer/diet-plan-actions"

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
      membership_plan_id,
      client:clients(user:users(full_name)),
      membership_plan:membership_plans(plan_name, price, duration_days)
    `,
    )
    .eq("trainer_id", trainerProfile?.id)
    .order("created_at", { ascending: false })

  // Fetch clients for the dialog
  const { data: clients } = await supabase
    .from("clients")
    .select(`
      id,
      user:users(full_name)
    `)
    .eq("assigned_trainer_id", trainerProfile?.id)

  // Fetch membership plans
  const { data: membershipPlans } = await supabase
    .from("membership_plans")
    .select(`
      id,
      plan_name,
      description,
      price,
      duration_days,
      features
    `)
    .eq("is_active", true)
    .order("price", { ascending: true })

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Diet Plans</h1>
            <DietPlanDialog clients={clients || []} membershipPlans={membershipPlans || []} />
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
                      <TableHead>Membership Plan</TableHead>
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
                        <TableCell>{(plan.client as any)?.user?.full_name || "N/A"}</TableCell>
                        <TableCell>
                          {plan.membership_plan ? 
                            `${(plan.membership_plan as any).plan_name} (${(plan.membership_plan as any).duration_days} days)` : 
                            "No membership plan"
                          }
                        </TableCell>
                        <TableCell>{plan.daily_calories}</TableCell>
                        <TableCell>{plan.protein_grams}</TableCell>
                        <TableCell>{plan.carbs_grams}</TableCell>
                        <TableCell>{plan.fat_grams}</TableCell>
                        <TableCell>{new Date(plan.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DietPlanActions 
                            planId={plan.id}
                            planName={plan.plan_name}
                            planData={{
                              plan_name: plan.plan_name,
                              description: plan.description,
                              daily_calories: plan.daily_calories,
                              protein_grams: plan.protein_grams,
                              carbs_grams: plan.carbs_grams,
                              fat_grams: plan.fat_grams,
                              client_id: (plan.client as any)?.id || "",
                              membership_plan_id: plan.membership_plan_id
                            }}
                            clients={clients || []}
                            membershipPlans={membershipPlans || []}
                          />
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
