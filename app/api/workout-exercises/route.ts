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

    const { error } = await supabase.from("workout_exercises").insert({
      workout_plan_id: body.workout_plan_id,
      exercise_name: body.exercise_name,
      sets: body.sets,
      reps: body.reps,
      weight: body.weight,
      duration_minutes: body.duration_minutes,
      rest_seconds: body.rest_seconds,
      notes: body.notes,
      day_of_week: body.day_of_week,
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
    const workoutPlanId = searchParams.get("workout_plan_id")

    let query = supabase.from("workout_exercises").select("*")

    if (workoutPlanId) {
      query = query.eq("workout_plan_id", workoutPlanId)
    }

    const { data, error } = await query.order("day_of_week", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
