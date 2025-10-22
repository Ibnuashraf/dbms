import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { TrainerSidebar } from "@/components/trainer/trainer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default async function TrainerClientsPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "trainer") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get trainer profile
  const { data: trainerProfile } = await supabase.from("trainers").select("*").eq("user_id", user.id).single()

  // Fetch assigned clients
  const { data: clients } = await supabase
    .from("clients")
    .select(
      `
      id,
      age,
      height,
      weight,
      fitness_goal,
      membership_status,
      user:users(id, full_name, email, phone)
    `,
    )
    .eq("assigned_trainer_id", trainerProfile?.id)
    .order("join_date", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">My Clients</h1>

          <Card>
            <CardHeader>
              <CardTitle>Assigned Clients</CardTitle>
              <CardDescription>Manage your assigned clients and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Fitness Goal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients?.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.user?.full_name}</TableCell>
                        <TableCell>{client.user?.email}</TableCell>
                        <TableCell>{client.age || "N/A"}</TableCell>
                        <TableCell>{client.weight ? `${client.weight} kg` : "N/A"}</TableCell>
                        <TableCell>{client.fitness_goal || "N/A"}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              client.membership_status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {client.membership_status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Progress
                            </Button>
                            <Button size="sm">Create Plan</Button>
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
