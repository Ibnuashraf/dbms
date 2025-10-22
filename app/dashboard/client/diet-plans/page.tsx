import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ClientDietPlansPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "client") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get client profile
  const { data: clientProfile } = await supabase.from("clients").select("*").eq("user_id", user.id).single()

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
      diet_meals(id, meal_type, meal_name, calories, protein, carbs, fat)
    `,
    )
    .eq("client_id", clientProfile?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">My Diet Plans</h1>

          <div className="space-y-6">
            {dietPlans?.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.plan_name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-semibold">Daily Calories</p>
                      <p className="text-lg font-bold">{plan.daily_calories}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Protein</p>
                      <p className="text-lg font-bold">{plan.protein_grams}g</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Carbs</p>
                      <p className="text-lg font-bold">{plan.carbs_grams}g</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Fat</p>
                      <p className="text-lg font-bold">{plan.fat_grams}g</p>
                    </div>
                  </div>

                  {plan.diet_meals && plan.diet_meals.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2">Meals</p>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Meal</TableHead>
                              <TableHead>Calories</TableHead>
                              <TableHead>Protein</TableHead>
                              <TableHead>Carbs</TableHead>
                              <TableHead>Fat</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {plan.diet_meals.map((meal: any) => (
                              <TableRow key={meal.id}>
                                <TableCell className="capitalize">{meal.meal_type}</TableCell>
                                <TableCell>{meal.meal_name}</TableCell>
                                <TableCell>{meal.calories}</TableCell>
                                <TableCell>{meal.protein}g</TableCell>
                                <TableCell>{meal.carbs}g</TableCell>
                                <TableCell>{meal.fat}g</TableCell>
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
