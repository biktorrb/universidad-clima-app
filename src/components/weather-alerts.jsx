"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWeatherAlerts } from "@/lib/weather-api"

export default function WeatherAlerts() {
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const dismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))

    // Store dismissed alerts in localStorage to prevent them from reappearing
    const dismissedAlerts = JSON.parse(localStorage.getItem("dismissedAlerts") || "[]")
    localStorage.setItem("dismissedAlerts", JSON.stringify([...dismissedAlerts, id]))
  }

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setIsLoading(true)
        const alertsData = await getWeatherAlerts()

        // Filter out previously dismissed alerts
        const dismissedAlerts = JSON.parse(localStorage.getItem("dismissedAlerts") || "[]")
        const filteredAlerts = alertsData.filter((alert) => !dismissedAlerts.includes(alert.id))

        setAlerts(filteredAlerts)
        setError(null)
      } catch (err) {
        console.error("Error cargando alertas:", err)
        setError("Fallo al cargar alertas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()

    // Refresh alerts every hour
    const intervalId = setInterval(fetchAlerts, 60 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return <div className="h-16 flex items-center">Cargando Alertas...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Alert key={alert.id} variant={alert.type === "severe" ? "destructive" : "default"} className="relative">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => dismissAlert(alert.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </Alert>
      ))}
    </div>
  )
}

