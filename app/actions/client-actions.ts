"use server"

import { getSupabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function recordProgress(data: {
  weight: number
  body_fat_percentage: number
  measurements_chest: number
  measurements_waist: number
  measurements_hips: number
  notes: string
  client_id: string
}) {
  const supabase = await getSupabaseServer()

  const { error } = await supabase.from("progress_tracking").insert({
    client_id: data.client_id,
    weight: data.weight,
    body_fat_percentage: data.body_fat_percentage,
    measurements_chest: data.measurements_chest,
    measurements_waist: data.measurements_waist,
    measurements_hips: data.measurements_hips,
    notes: data.notes,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/client/progress")
}
