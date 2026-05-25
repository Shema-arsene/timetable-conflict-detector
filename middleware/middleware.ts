// frontend/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = ["/", "/auth/signin", "/auth/signup"]
const protectedRoutes = [
  "/timetable",
  "/rooms",
  "/lecturers",
  "/schools",
  "/modules",
]

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "")

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  )

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(`${route}/`),
  )

  // Redirect to signin if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (isPublicRoute && token && request.nextUrl.pathname !== "/auth/signout") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/timetable/:path*",
    "/rooms/:path*",
    "/lecturers/:path*",
    "/schools/:path*",
    "/modules/:path*",
    "/auth/:path*",
  ],
}
