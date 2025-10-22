"use server"

import { getSupabaseServer } from "./supabase-server"
import { redirect } from "next/navigation"

export async function signUp(email: string, password: string, fullName: string, role: "admin" | "trainer" | "client") {
  const supabase = await getSupabaseServer()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Disable email confirmation for simpler auth
      emailRedirectTo: undefined,
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

  // Pre-fetch user role to avoid additional queries after redirect
  if (data.user) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single()
    
    return { 
      data: {
        ...data,
        userRole: userProfile?.role
      }
    }
  }

  return { data }
}

export async function signOut() {
  const supabase = await getSupabaseServer()
  
  // Sign out from Supabase
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error("Sign out error:", error)
  }
  
  // Force redirect to login page
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

  // Only select essential fields to reduce data transfer
  const { data: userProfile } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single()

  return userProfile
}

export async function getUserRole() {
  const user = await getCurrentUser()
  return user?.role || null
}

// Optimized function that gets both user and role in a single call
export async function getCurrentUserWithRole() {
  const supabase = await getSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, role: null }
  }

  // Only select the fields we need to reduce data transfer
  const { data: userProfile } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single()

  return { 
    user: userProfile, 
    role: userProfile?.role || null 
  }
}