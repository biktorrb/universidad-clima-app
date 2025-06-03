import { SignJWT, jwtVerify, type JWTPayload } from "jose" // Added 'type JWTPayload'
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-here-change-in-production")

// Admin credentials (in production, store these securely in database)
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
}

// Corrected: 'payload' now has the JWTPayload type
export async function createToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error("Token verification failed:", error);
    return null
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("admin-token")?.value

  if (!token) {
    return null
  }

  return await verifyToken(token)
}

export function validateCredentials(username: string, password: string) {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies()
  ;(await cookieStore).set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function clearAuthCookie() {
  const cookieStore = cookies()
  ;(await cookieStore).delete("admin-token")
}