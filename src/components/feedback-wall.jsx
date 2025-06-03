"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Bus, CloudOff, Thermometer, Brain } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { es } from 'date-fns/locale'; 

export default function FeedbackWall() {
  const [data, setData] = useState({
    feedback: [],
    stats: { transport: 0, outdoor: 0, anxiety: 0, health: 0 },
    total: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRecentFeedback() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/feedback/recent/")

        if (!response.ok) {
          throw new Error("Fallo al cargar información de comentarios.")
        }

        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        console.error("Error al cargar información de comentarios.", err)
        setError("No se pudieron cargar los comentarios mas recientes, intente mas tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentFeedback()

    // Refresaca los datos cada 5 min
    const intervalId = setInterval(fetchRecentFeedback, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Icono basado en el impacto
  const getImpactIcon = (impact) => {
    switch (impact) {
      case "transport":
        return <Bus className="h-4 w-4 text-blue-500" />
      case "outdoor":
        return <CloudOff className="h-4 w-4 text-green-500" />
      case "anxiety":
        return <Brain className="h-4 w-4 text-purple-500" />
      case "health":
        return <Thermometer className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getImpactLabel = (impact) => {
    switch (impact) {
      case "transport":
        return "Retrasos con el transporte"
      case "outdoor":
        return "Actividades en exteriores limitadas"
      case "anxiety":
        return "Incremento de ansiedad"
      case "health":
        return "Problemas de salud"
      default:
        return "Otros impactos"
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case "transport":
        return "bg-blue-100 text-blue-800"
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

  const calculatePercentage = (value) => {
    if (data.total === 0) return 0
    return (value / data.total) * 100
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Impacto del clima en estudiantes</CardTitle>
        <CardDescription>Comentarios de estudiantes en los ultimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wall">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wall">Muro de comentarios</TabsTrigger>
            <TabsTrigger value="stats">Estadisticas</TabsTrigger>
          </TabsList>

          <TabsContent value="wall" className="pt-4">
            {data.feedback.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Sin comentarios en los ultimos 7 dias.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {data.feedback.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2 bg-muted/50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(item.impact)}`}
                          >
                            {getImpactIcon(item.impact)}
                            <span className="ml-1">{getImpactLabel(item.impact)}</span>
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true, locale:es })}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-3">
                      <p className="text-sm">{item.feedback}</p>
                      {item.weatherData && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Clima: {item.weatherData.temperature.toFixed(1)}°C, {item.weatherData.condition}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Distribución del impacto</h3>
                <div className="bg-muted rounded-lg p-4">
                  {data.total === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No hay datos disponibles de los ultimos 7 dias.</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center">
                            <Bus className="h-3 w-3 text-blue-500 mr-1" />
                            Retrasos de transporte
                          </span>
                          <span>
                            {data.stats.transport} ({calculatePercentage(data.stats.transport).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-blue-100 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${calculatePercentage(data.stats.transport)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center">
                            <CloudOff className="h-3 w-3 text-green-500 mr-1" />
                            Actividades en exteriores limitadas
                          </span>
                          <span>
                            {data.stats.outdoor} ({calculatePercentage(data.stats.outdoor).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${calculatePercentage(data.stats.outdoor)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center">
                            <Brain className="h-3 w-3 text-purple-500 mr-1" />
                            Incremento de ansiedad
                          </span>
                          <span>
                            {data.stats.anxiety} ({calculatePercentage(data.stats.anxiety).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-purple-100 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${calculatePercentage(data.stats.anxiety)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="flex items-center">
                            <Thermometer className="h-3 w-3 text-red-500 mr-1" />
                            Problemas de salud
                          </span>
                          <span>
                            {data.stats.health} ({calculatePercentage(data.stats.health).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-red-100 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${calculatePercentage(data.stats.health)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Resumen</h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.total}</div>
                      <div className="text-xs text-muted-foreground">Comentarios recibidos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {getImpactLabel(Object.entries(data.stats).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A")}
                      </div>
                      <div className="text-xs text-muted-foreground">Impacto mas común</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
