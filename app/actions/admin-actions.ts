"use server"

import { getSupabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function assignTrainerToMember(memberId: string, trainerId: string) {
  const supabase = await getSupabaseServer()

  const { error } = await supabase.from("clients").update({ assigned_trainer_id: trainerId }).eq("id", memberId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/admin/members")
}

export async function deleteMember(memberId: string) {
  const supabase = await getSupabaseServer()

  const { error } = await supabase.from("clients").delete().eq("id", memberId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/admin/members")
}

export async function deleteTrainer(trainerId: string) {
  const supabase = await getSupabaseServer()

  const { error } = await supabase.from("trainers").delete().eq("id", trainerId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/admin/trainers")
}
