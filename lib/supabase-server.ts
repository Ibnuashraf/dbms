import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Cache the cookie store to avoid repeated calls
let cachedCookieStore: Awaited<ReturnType<typeof cookies>> | null = null

export async function getSupabaseServer() {
  // Reuse cookie store when possible to reduce overhead
  if (!cachedCookieStore) {
    cachedCookieStore = await cookies()
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cachedCookieStore!.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => 
              cachedCookieStore!.set(name, value, options)
            )
          } catch {
            // Handle cookie setting errors silently
          }
        },
      },
    },
  )
  
  return supabase
}
