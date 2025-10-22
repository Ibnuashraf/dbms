"use server"

import { getSupabaseServer } from "./supabase-server"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string, fullName: string, role: "admin" | "trainer" | "client") {
  const supabase = await getSupabaseServer()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Create user profile in users table
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
      password_hash: "", // Password is handled by Supabase Auth
    })

    if (profileError) {
      return { error: profileError.message }
    }

    // If trainer, create trainer profile
    if (role === "trainer") {
      await supabase.from("trainers").insert({
        user_id: data.user.id,
        is_active: true,
      })
    }

    // If client, create client profile
    if (role === "client") {
      await supabase.from("clients").insert({
        user_id: data.user.id,
        membership_status: "active",
      })
    }
  }

  return { data }
}

export async function signIn(email: string, password: string) {
  const supabase = await getSupabaseServer()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export async function signOut() {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return userProfile
}

export async function getUserRole() {
  const user = await getCurrentUser()
  return user?.role || null
}
