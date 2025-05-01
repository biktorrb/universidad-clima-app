"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Thermometer, Sun, Wind, Umbrella, CloudRain } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentWeather, getHourlyForecast } from "@/lib/weather-api"

export default function WeatherRecommendations() {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchWeatherAndGenerateRecommendations() {
      try {
        setIsLoading(true)

        // Fetch current weather and forecast data
        const [currentWeather, forecast] = await Promise.all([getCurrentWeather(), getHourlyForecast(24)])

        // Generate recommendations based on weather data
        const newRecommendations = []

        // Temperature-based recommendations
        if (currentWeather.temperature > 30) {
          newRecommendations.push({
            id: 1,
            icon: <Sun className="h-5 w-5" />,
            title: "Mantente hidratado",
            description: "Hoy habrán altas temperaturas, bebe agua constantemente",
            iconBgColor: "bg-red-100",
            iconColor: "text-red-700",
          })
        } else if (currentWeather.temperature < 10) {
          newRecommendations.push({
            id: 2,
            icon: <Thermometer className="h-5 w-5" />,
            title: "Usa abrigo",
            description: "Se esperan bajas temperaturas, cubrete.",
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-700",
          })
        }

        // Precipitation-based recommendations
        const maxPrecipitation = Math.max(...forecast.slice(0, 8).map((hour) => hour.precipitation))
        if (maxPrecipitation > 0.5) {
          newRecommendations.push({
            id: 3,
            icon: <Umbrella className="h-5 w-5" />,
            title: "Trae un paraguas",
            description: `Se esperan precipitaciones de ${maxPrecipitation.toFixed(1)}mm`,
            iconBgColor: "bg-yellow-100",
            iconColor: "text-yellow-700",
          })
        }

        // UV index-based recommendations
        if (currentWeather.uvIndex > 5) {
          newRecommendations.push({
            id: 4,
            icon: <Sun className="h-5 w-5" />,
            title: "Protegete del sol",
            description: `Indice UV es ${currentWeather.uvIndex.toFixed(0)} (${currentWeather.uvIndex > 8 ? "Muy Alto" : "Alto"}).`,
            iconBgColor: "bg-orange-100",
            iconColor: "text-orange-700",
          })
        }

        // Wind-based recommendations
        if (currentWeather.windSpeed > 20) {
          newRecommendations.push({
            id: 5,
            icon: <Wind className="h-5 w-5" />,
            title: "Fuertes vientos",
            description: "Toma previsiones contra el fuerte viento.",
            iconBgColor: "bg-cyan-100",
            iconColor: "text-cyan-700",
          })
        }

        // Humidity-based recommendations
        if (currentWeather.humidity > 80) {
          newRecommendations.push({
            id: 6,
            icon: <Droplets className="h-5 w-5" />,
            title: "Humedad Alta",
            description: "Los niveles de humedad pueden afectar la sensación de confort.",
            iconBgColor: "bg-blue-100",
            iconColor: "text-blue-700",
          })
        }

        // Add a general recommendation if we don't have many specific ones
        if (newRecommendations.length < 2) {
          newRecommendations.push({
            id: 7,
            icon: <CloudRain className="h-5 w-5" />,
            title: "Revisa el las condiciones climaticas frecuentemente.",
            description: `Condición climatica actual: ${currentWeather.condition}`,
            iconBgColor: "bg-slate-100",
            iconColor: "text-slate-700",
          })
        }

        // Limit to 3 recommendations
        setRecommendations(newRecommendations.slice(0, 3))
        setError(null)
      } catch (err) {
        console.error("Error generando recomendaciones:", err)
        setError("Fallo al cargar recomendaciones")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherAndGenerateRecommendations()

    // Refresh recommendations every 30 minutes
    const intervalId = setInterval(fetchWeatherAndGenerateRecommendations, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-red-500">{error}</p>
          <button className="mt-2 text-sm text-primary hover:underline" onClick={() => window.location.reload()}>
            Retry
          </button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {recommendations.map((recommendation) => (
        <div key={recommendation.id} className="flex items-start gap-2">
          <div className={`${recommendation.iconBgColor} p-2 rounded-full`}>
            <span className={recommendation.iconColor}>{recommendation.icon}</span>
          </div>
          <div>
            <h3 className="font-medium">{recommendation.title}</h3>
            <p className="text-sm text-muted-foreground">{recommendation.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

