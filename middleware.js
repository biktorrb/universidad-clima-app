import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here-change-in-production")

export async function middleware(request) {
  // Only apply middleware to admin routes (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    try {
      const token = request.cookies.get("admin-token")?.value

      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }

      // Verify the token
      await jwtVerify(token, secret)

      // Token is valid, continue to the requested page
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
