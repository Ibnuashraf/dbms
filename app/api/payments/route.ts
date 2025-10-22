import { getSupabaseServer } from "@/lib/supabase-server"
import { getCurrentUser } from "@/lib/auth-actions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const body = await request.json()

    const { error } = await supabase.from("payments").insert({
      client_id: body.client_id,
      amount: body.amount,
      payment_type: body.payment_type,
      payment_method: body.payment_method,
      status: "completed",
      description: body.description,
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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("client_id")

    let query = supabase.from("payments").select("*")

    if (clientId) {
      query = query.eq("client_id", clientId)
    }

    const { data, error } = await query.order("paid_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
