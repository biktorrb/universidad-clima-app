import { NextResponse } from "next/server"
import { validateCredentials, createToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Crea token JWT
    const token = await createToken({
      username,
      role: "admin",
      loginTime: new Date().toISOString(),
    })

    // rea token JWT en cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
