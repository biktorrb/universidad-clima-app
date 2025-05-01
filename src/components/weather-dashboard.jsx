"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Droplets, Sun, Wind } from "lucide-react"
import WeatherChart from "./weather-chart"
import { Badge } from "@/components/ui/badge"
import { getCurrentWeather, getHourlyForecast } from "@/lib/weather-api"

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState({
    current: {
      temperature: 0,
      humidity: 0,
      precipitation: 0,
      condition: "Cargando...",
      uvIndex: 0,
      windSpeed: 0,
    },
    hourly: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        setIsLoading(true)

        // Fetch current weather and hourly forecast in parallel
        const [current, hourly] = await Promise.all([getCurrentWeather(), getHourlyForecast(48)])

        setWeatherData({
          current,
          hourly,
        })

        setError(null)
      } catch (err) {
        console.error("Ocurrio un error consultando el clima actual:", err)
        setError("Fallo al cargar datos del clima, intente mas tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherData()

    // Refresh data every 30 minutes
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Cargando informaición del clima...</div>
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={() => window.location.reload()}>
            Intenta nuevamente
          </button>
        </div>
      </div>
    )
  }

  // Get the weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (condition.includes("Clear") || condition.includes("Sunny")) {
      return <Sun className="h-5 w-5 text-yellow-500" />
    } else if (condition.includes("Rain") || condition.includes("Drizzle")) {
      return <Droplets className="h-5 w-5 text-blue-500" />
    } else {
      return <Cloud className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Clima Actual</CardTitle>
          <CardDescription>Latitud 9.3503, Altitud 65.3245</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg">
              <div className="text-5xl font-bold">{weatherData.current.temperature.toFixed(1)}°C</div>
              <div className="flex items-center gap-1 mt-2">
                {getWeatherIcon(weatherData.current.condition)}
                <span>{weatherData.current.condition}</span>
              </div>
            </div>

            <div className="col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Humedad</div>
                  <div>{weatherData.current.humidity.toFixed(0)}%</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-slate-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Precipitación</div>
                  <div>{weatherData.current.precipitation.toFixed(1)} mm</div>
                </div>
              </div>
            </div>

            <div className="col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Rayos UV</div>
                  <div>
                    {weatherData.current.uvIndex.toFixed(0)}
                    <Badge variant="outline" className="ml-1">
                      {weatherData.current.uvIndex > 8
                        ? "Muy Alto"
                        : weatherData.current.uvIndex > 5
                          ? "Alto"
                          : weatherData.current.uvIndex > 2
                            ? "Moderado"
                            : "Bajo"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-cyan-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Viento</div>
                  <div>{weatherData.current.windSpeed.toFixed(1)} km/h</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Pronostico de 48H</CardTitle>
          <CardDescription>Temperatura y pronotistco de lluvia</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="temperature">
            <TabsList className="mb-4">
              <TabsTrigger value="temperature">Temperatura</TabsTrigger>
              <TabsTrigger value="precipitation">Precipitación</TabsTrigger>
            </TabsList>
            <TabsContent value="temperature">
              <WeatherChart
                data={weatherData.hourly.map((hour) => ({
                  time: hour.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  value: hour.temperature,
                  date: hour.time.toLocaleDateString([], { weekday: "short" }),
                }))}
                yLabel="Temperature (°C)"
                color="#f97316"
              />
            </TabsContent>
            <TabsContent value="precipitation">
              <WeatherChart
                data={weatherData.hourly.map((hour) => ({
                  time: hour.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  value: hour.precipitation,
                  date: hour.time.toLocaleDateString([], { weekday: "short" }),
                }))}
                yLabel="Precipitation (mm)"
                color="#0ea5e9"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 grid grid-cols-4 md:grid-cols-8 gap-2 overflow-x-auto pb-2">
            {weatherData.hourly.slice(0, 24).map((hour, index) => (
              <div key={index} className="flex flex-col items-center p-2 text-center">
                <div className="text-sm text-muted-foreground">{hour.time.getHours()}:00</div>
                <div className="my-1">{getWeatherIcon(hour.condition)}</div>
                <div className="text-sm font-medium">{hour.temperature.toFixed(1)}°</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

