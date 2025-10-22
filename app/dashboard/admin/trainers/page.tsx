import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { TrainersTable } from "@/components/admin/trainers-table"
import { deleteTrainer } from "@/app/actions/admin-actions"

export default async function TrainersPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "admin") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Fetch trainers with their user data
  const { data: trainers } = await supabase
    .from("trainers")
    .select(
      `
      id,
      specialization,
      hourly_rate,
      salary,
      is_active,
      user:users(id, full_name, email)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Trainers Management</h1>
          <TrainersTable trainers={trainers || []} onDeleteTrainer={deleteTrainer} />
        </div>
      </main>
    </div>
  )
}
