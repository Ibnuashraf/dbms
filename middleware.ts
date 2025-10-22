import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Only check authentication for protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/auth/")

  if (isProtectedRoute || isAuthRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect dashboard routes
    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && user) {
      // For auth routes, redirect to dashboard without role check to avoid extra DB call
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*"
  ],
}
