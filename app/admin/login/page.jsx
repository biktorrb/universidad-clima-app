"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield, Home, ArrowLeft, LogIn } from "lucide-react"

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-slate-100 dark:from-sky-950 dark:to-slate-950 p-4">
      <div className="fixed top-6 left-6 z-10">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="group bg-white/80 backdrop-blur-sm border-sky-200 hover:bg-sky-50 hover:border-sky-300 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            <Home className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Volver al Sitio Principal</span>
            <span className="sm:hidden">Inicio</span>
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            {/* Logo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-full p-4 shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full p-1.5 shadow-md">
                  <LogIn className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-600 to-yellow-600 text-transparent bg-clip-text">
              Panel de Administración
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Accede al sistema de gestión de Universidad Clima
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username"  className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre de Usuario</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-12 border-2 border-gray-200 focus:border-sky-500 focus:ring-sky-500/20 transition-all duration-300"
                  placeholder="Ingresa tu usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="h-12 border-2 border-gray-200 focus:border-sky-500 focus:ring-sky-500/20 transition-all duration-300"
                  placeholder="Ingresa tu contraseña"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Iniciando sesión...
                </div>
              ): (
                <div className="flex items-center">
                    <LogIn className="h-5 w-5 mr-2" />
                    Iniciar Sesión
                </div>
              )}
            </Button>
            <div className="flex items-center justify-center pt-2">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-all duration-300"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    ¿No eres administrador? Volver al inicio
                  </Button>
                </Link>
              </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  </div>
  )
}
