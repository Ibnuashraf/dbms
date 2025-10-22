"use server"

import { getSupabaseServer } from "@/lib/supabase-server"
import { getCurrentUser } from "@/lib/auth-actions"
import { revalidatePath } from "next/cache"

export async function createWorkoutPlan(data: {
  plan_name: string
  description: string
  duration_weeks: number
  difficulty_level: string
  client_id: string
}) {
  const user = await getCurrentUser()
  const supabase = await getSupabaseServer()

  // Get trainer profile
  const { data: trainerProfile } = await supabase.from("trainers").select("*").eq("user_id", user?.id).single()

  const { error } = await supabase.from("workout_plans").insert({
    trainer_id: trainerProfile?.id,
    client_id: data.client_id,
    plan_name: data.plan_name,
    description: data.description,
    duration_weeks: data.duration_weeks,
    difficulty_level: data.difficulty_level,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/trainer/workout-plans")
}

export async function createDietPlan(data: {
  plan_name: string
  description: string
  daily_calories: number
  protein_grams: number
  carbs_grams: number
  fat_grams: number
  client_id: string
}) {
  const user = await getCurrentUser()
  const supabase = await getSupabaseServer()

  // Get trainer profile
  const { data: trainerProfile } = await supabase.from("trainers").select("*").eq("user_id", user?.id).single()

  const { error } = await supabase.from("diet_plans").insert({
    trainer_id: trainerProfile?.id,
    client_id: data.client_id,
    plan_name: data.plan_name,
    description: data.description,
    daily_calories: data.daily_calories,
    protein_grams: data.protein_grams,
    carbs_grams: data.carbs_grams,
    fat_grams: data.fat_grams,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/trainer/diet-plans")
}
