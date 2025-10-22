import { getSupabaseServer } from "@/lib/supabase-server"
import { getCurrentUser, getUserRole } from "@/lib/auth-actions"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    const role = await getUserRole()

    if (!user || role !== "trainer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getSupabaseServer()
    const body = await request.json()

    const { error } = await supabase.from("diet_meals").insert({
      diet_plan_id: body.diet_plan_id,
      meal_type: body.meal_type,
      meal_name: body.meal_name,
      calories: body.calories,
      protein: body.protein,
      carbs: body.carbs,
      fat: body.fat,
      ingredients: body.ingredients,
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
    const dietPlanId = searchParams.get("diet_plan_id")

    let query = supabase.from("diet_meals").select("*")

    if (dietPlanId) {
      query = query.eq("diet_plan_id", dietPlanId)
    }

    const { data, error } = await query.order("meal_type", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
