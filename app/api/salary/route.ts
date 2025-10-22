import { getSupabaseServer } from "@/lib/supabase-server"
import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    const role = await getUserRole()

    if (!user || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const body = await request.json()

    const { error } = await supabase.from("salary_records").insert({
      trainer_id: body.trainer_id,
      amount: body.amount,
      payment_period_start: body.payment_period_start,
      payment_period_end: body.payment_period_end,
      status: "pending",
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    const role = await getUserRole()

    if (!user || role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const trainerId = searchParams.get("trainer_id")

    let query = supabase.from("salary_records").select("*")

    if (trainerId) {
      query = query.eq("trainer_id", trainerId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
