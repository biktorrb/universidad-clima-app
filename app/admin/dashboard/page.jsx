"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SimpleSelect } from "@/components/ui/select"
import {
  AlertCircle,
  Download,
  Filter,
  LogOut,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Login
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [pagination, setPagination] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    career: "all",
    impact: "all",
    startDate: "",
    endDate: "",
    page: 1,
  })
  const router = useRouter()

  // Career and impact options for filters
  const careerOptions = [
    { value: "all", label: "Todas las carreras" },
    { value: "Ingenieria de Sistemas", label: "Ingenieria de Sistemas" },
    { value: "Ingenieria Electrica", label: "Ingenieria Electrica" },
    { value: "Contaduria Publica", label: "Contaduria Publica" },
    { value: "Enfermeria", label: "Enfermeria" },
  ]

  const impactOptions = [
    { value: "all", label: "Todos los impactos" },
    { value: "transport", label: "Retrasos en Transporte" },
    { value: "outdoor", label: "Actividades en exteriores limitadas" },
    { value: "anxiety", label: "Incremento de ansiedad" },
    { value: "health", label: "Problemas de salud" },
  ]

  // Verify authentication on component mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const response = await fetch("/api/admin/verify")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push("/admin/login")
        }
      } catch (err) {
        router.push("/admin/login")
      }
    }

    verifyAuth()
  }, [router])

  // Fetch feedback data
  useEffect(() => {
    if (user) {
      fetchFeedback()
    }
  }, [user, filters])

  const fetchFeedback = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/admin/feedback?${params}`)

      if (response.ok) {
        const data = await response.json()
        setFeedback(data.feedback)
        setStatistics(data.statistics)
        setPagination(data.pagination)
        setError("")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Fallo al cargar comentarios")
      }
    } catch (err) {
      setError("Error de conexión, por favor intente de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      router.push("/admin/login")
    } catch (err) {
      console.error("Logout error:", err)
      router.push("/admin/login")
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  const exportData = () => {
    // Create CSV content
    const headers = ["Fecha", "Hora", "Carrera", "Impacto", "Comentario", "Recomendación", "Clima"]
    const csvContent = [
      headers.join(","),
      ...feedback.map((item) =>
        [
          format(new Date(item.timestamp), "yyyy-MM-dd"),
          format(new Date(item.timestamp), "HH:mm:ss"),
          `"${item.career || ""}"`,
          `"${item.impact || ""}"`,
          `"${item.feedback?.replace(/"/g, '""') || ""}"`,
          `"${item.suggestion?.replace(/"/g, '""') || ""}"`,
          `"${item.weatherData ? `${item.weatherData.temperature}°C, ${item.weatherData.condition}` : ""}"`,
        ].join(","),
      ),
    ].join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `comentarios-export-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Get career color
  const getCareerColor = (career) => {
    switch (career) {
      case "Ingenieria de Sistemas":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
      case "Ingenieria Electrica":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Contaduria Publica":
        return "bg-leaf-100 text-leaf-800 dark:bg-leaf-900/30 dark:text-leaf-300"
      case "Enfermeria":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300"
    }
  }

  // Get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case "transport":
        return "bg-100 text-800"
      case "outdoor":
        return "bg-green-100 text-green-800"
      case "anxiety":
        return "bg-purple-100 text-purple-800"
      case "health":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administrador</h1>
              <p className="text-muted-foreground">Bienvenido, {user.username}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-sky-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total de comentarios</p>
                    <p className="text-2xl font-bold">{statistics.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-leaf-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Careers</p>
                    <p className="text-2xl font-bold">{Object.keys(statistics.careerBreakdown).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Impacto mas común</p>
                    <p className="text-lg font-bold">
                      {Object.entries(statistics.impactBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-gray-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm font-bold">
                      {feedback.length > 0
                        ? formatDistanceToNow(new Date(feedback[0].timestamp), { addSuffix: true })
                        : "No data"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <Label>Carrera</Label>
                <SimpleSelect
                  value={filters.career}
                  onValueChange={(value) => handleFilterChange("career", value)}
                  options={careerOptions}
                  placeholder="Selecciona la carrera"
                />
              </div>
              <div>
                <Label>Impacto</Label>
                <SimpleSelect
                  value={filters.impact}
                  onValueChange={(value) => handleFilterChange("impact", value)}
                  options={impactOptions}
                  placeholder="Selecciona el impacto"
                />
              </div>
              <div>
                <Label>Fecha de inicio</Label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </div>
              <div>
                <Label>Fecha final</Label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={exportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <Card>
          <CardHeader>
            <CardTitle>Comentarios enviados</CardTitle>
            <CardDescription>
              {pagination &&
                `Mostrando ${(pagination.currentPage - 1) * pagination.limit + 1}-${Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} de ${pagination.totalCount} comentarios`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Cargando datos de comentarios...</div>
            ) : feedback.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No existen comentarios que cumplan con el criterio de busqueda.
              </div>
            ) : (
              <div className="space-y-4">
                {feedback.map((item) => (
                  <Card key={item._id} className="border-l-4 border-l-sky-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {item.career && (
                            <Badge variant="outline" className={getCareerColor(item.career)}>
                              {item.career}
                            </Badge>
                          )}
                          {item.impact && (
                            <Badge variant="outline" className={getImpactColor(item.impact)}>
                              {item.impact == "transport" ? "Retrasos con el transporte" 
                                : item.impact == "outdoor" ? "Actividades en exteriores limitadas"
                                : item.impact == "anxiety" ? "Incremento de ansiedad"
                                : item.impact == "health" ? "Problemas de salud"
                                : "Otros problemas de salud"}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{format(new Date(item.timestamp), "PPP")}</div>
                          <div>{format(new Date(item.timestamp), "p")}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Comentario:</h4>
                          <p className="text-sm">{item.feedback}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-1">Recomendación:</h4>
                          <p className="text-sm">{item.suggestion}</p>
                        </div>

                        {item.weatherData && (
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                            Weather at submission: {item.weatherData.temperature.toFixed(1)}°C,{" "}
                            {item.weatherData.condition}
                            {item.weatherData.humidity && ` • Humidity: ${item.weatherData.humidity.toFixed(0)}%`}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Pagina {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
