"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, BarChart3, MessageSquare, LogOut, Home, ArrowLeft } from "lucide-react"

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function verifyAuth() {
      try {
        const response = await fetch("/api/admin/verify")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          if (pathname !== "/admin/login") {
            router.push("/admin/login")
          }
        }
      } catch (err) {
        if (pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [router, pathname])

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (err) {
      console.error("Logout error:", err)
      router.push("/admin/login")
    }
  }

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return children
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100">
        <div className="text-center bg-sky-600 rounded-full p-3 mx-auto mb-4 w-fit">
          <Shield className="h-8 w-8 animate-pulse text-white" />
          <p className="text-sky-700 font-medium">Cargando panel de administrador...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-sky-blue-600" />
                <span className="font-bold text-lg">Panel de administrador</span>
              </div>
              <nav className="hidden md:flex items-center space-x-1">
                <Link href="/">
                  <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Inicio
                  </Button>
                </Link>
                <Link href="/admin/dashboard">
                  <Button variant={pathname === "/admin/dashboard" ? "default" : "ghost"} size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Panel
                  </Button>
                </Link>
                {/* <Link href="/admin/feedback">
                  <Button variant={pathname === "/admin/feedback" ? "default" : "ghost"} size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comentarios
                  </Button>
                </Link> */}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Bienvenido, <span className="font-medium">{user.username}</span>
              </div>
              {/* <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b border-border bg-card">
        <div className="container mx-auto px-4 py-2">
          <nav className="flex items-center space-x-1 overflow-x-auto">
            <Link href="/">
              <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
                <Home className="h-4 w-4 mr-1" />
                Inicio
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant={pathname === "/admin/dashboard" ? "default" : "ghost"} size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                Panel
              </Button>
            </Link>
            {/* <Link href="/admin/feedback">
              <Button variant={pathname === "/admin/feedback" ? "default" : "ghost"} size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Comentarios
              </Button>
            </Link> */}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  )
}
