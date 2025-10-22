import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { getSupabaseServer } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { ClientSidebar } from "@/components/client/client-sidebar"
import { ProgressForm } from "@/components/client/progress-form"
import { ProgressChart } from "@/components/client/progress-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function ClientProgressPage() {
  const user = await getCurrentUser()
  const role = await getUserRole()

  if (!user || role !== "client") {
    redirect("/auth/login")
  }

  const supabase = await getSupabaseServer()

  // Get client profile
  const { data: clientProfile } = await supabase.from("clients").select("*").eq("user_id", user.id).single()

  // Fetch progress records
  const { data: progressRecords } = await supabase
    .from("progress_tracking")
    .select("*")
    .eq("client_id", clientProfile?.id)
    .order("recorded_at", { ascending: false })

  // Format data for chart
  const chartData = (progressRecords || []).reverse().map((record) => ({
    date: new Date(record.recorded_at).toLocaleDateString(),
    weight: record.weight || 0,
    bodyFat: record.body_fat_percentage || 0,
  }))

  return (
    <div className="flex h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Progress Tracking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProgressForm clientId={clientProfile?.id} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Latest Measurements</CardTitle>
                <CardDescription>Your most recent progress record</CardDescription>
              </CardHeader>
              <CardContent>
                {progressRecords && progressRecords.length > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="text-2xl font-bold">{progressRecords[0].weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Body Fat</p>
                      <p className="text-2xl font-bold">{progressRecords[0].body_fat_percentage}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chest</p>
                      <p className="text-lg font-semibold">{progressRecords[0].measurements_chest} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Waist</p>
                      <p className="text-lg font-semibold">{progressRecords[0].measurements_waist} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hips</p>
                      <p className="text-lg font-semibold">{progressRecords[0].measurements_hips} cm</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No progress records yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {chartData.length > 0 && <ProgressChart data={chartData} />}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
              <CardDescription>All your recorded measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Body Fat</TableHead>
                      <TableHead>Chest</TableHead>
                      <TableHead>Waist</TableHead>
                      <TableHead>Hips</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressRecords?.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.recorded_at).toLocaleDateString()}</TableCell>
                        <TableCell>{record.weight} kg</TableCell>
                        <TableCell>{record.body_fat_percentage}%</TableCell>
                        <TableCell>{record.measurements_chest} cm</TableCell>
                        <TableCell>{record.measurements_waist} cm</TableCell>
                        <TableCell>{record.measurements_hips} cm</TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || "N/A"}</TableCell>
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
