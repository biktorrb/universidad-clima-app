import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    })

    // Clear the auth cookie
    response.cookies.delete("admin-token")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
