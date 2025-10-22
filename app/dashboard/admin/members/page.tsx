import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MembersTable } from "@/components/admin/members-table"
import { assignTrainerToMember, deleteMember } from "@/app/actions/admin-actions"

export default async function MembersPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "admin") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Fetch members with their user data
  const { data: members } = await supabase
    .from("clients")
    .select(
      `
      id,
      assigned_trainer_id,
      membership_status,
      join_date,
      user:users(id, full_name, email)
    `,
    )
    .order("join_date", { ascending: false })

  // Fetch trainers
  const { data: trainers } = await supabase.from("trainers").select(
    `
      id,
      user:users(id, full_name, email)
    `,
  )

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Members Management</h1>
          <MembersTable
            members={members || []}
            trainers={trainers || []}
            onAssignTrainer={assignTrainerToMember}
            onDeleteMember={deleteMember}
          />
        </div>
      </main>
    </div>
  )
}
