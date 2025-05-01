"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, Droplets, Sun, Thermometer, Wind } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentWeather } from "@/lib/weather-api"
import dynamic from "next/dynamic"

// Import Leaflet dynamically to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

// Constants for the campus location
const CAMPUS_LATITUDE = 9.3467
const CAMPUS_LONGITUDE = -65.3369
const CAMPUS_NAME = "UNEFA"

export default function CampusMap() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Set mapLoaded to true on client-side
    setMapLoaded(true)

    async function fetchWeather() {
      try {
        setIsLoading(true)
        const weatherData = await getCurrentWeather()
        setCurrentWeather(weatherData)
        setError(null)
      } catch (err) {
        console.error("Error fetching campus weather data:", err)
        setError("Failed to load campus weather data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()

    // Refresh weather data every 30 minutes
    const intervalId = setInterval(fetchWeather, 30 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Get the weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (condition?.includes("Clear") || condition?.includes("Sunny")) {
      return <Sun className="h-5 w-5 text-yellow-500" />
    } else if (condition?.includes("Rain") || condition?.includes("Drizzle")) {
      return <Droplets className="h-5 w-5 text-blue-500" />
    } else {
      return <Cloud className="h-5 w-5 text-slate-500" />
    }
  }

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Cargando...</div>
  }

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button className="px-4 py-2 bg-primary text-white rounded-md" onClick={() => window.location.reload()}>
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Mapa de la universidad</CardTitle>
          <CardDescription>Vista de la universidad y clima actual</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="map">
            <TabsList className="mb-4">
              <TabsTrigger value="map">Vista del mapa</TabsTrigger>
              <TabsTrigger value="weather">Clima actual</TabsTrigger>
            </TabsList>
            <TabsContent value="map">
              <div className="border rounded-lg overflow-hidden" style={{ height: "400px" }}>
                {mapLoaded ? (
                  <MapContainer
                    center={[CAMPUS_LATITUDE, CAMPUS_LONGITUDE]}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[CAMPUS_LATITUDE, CAMPUS_LONGITUDE]}>
                      <Popup>
                        <div>
                          <strong>{CAMPUS_NAME}</strong>
                          <div className="flex items-center gap-1 mt-1">
                            {currentWeather && (
                              <>
                                <Thermometer className="h-4 w-4 text-red-500" />
                                <span>{currentWeather.temperature.toFixed(1)}°C</span>
                                <span className="mx-1">•</span>
                                {getWeatherIcon(currentWeather.condition)}
                                <span>{currentWeather.condition}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <Skeleton className="h-full w-full" />
                )}
              </div>
            </TabsContent>
            <TabsContent value="weather">
              {currentWeather && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center mb-6">
                      <div className="text-5xl font-bold mb-2">{currentWeather.temperature.toFixed(1)}°C</div>
                      <div className="flex items-center gap-1">
                        {getWeatherIcon(currentWeather.condition)}
                        <span className="text-xl">{currentWeather.condition}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {CAMPUS_NAME} • {CAMPUS_LATITUDE.toFixed(4)}, {CAMPUS_LONGITUDE.toFixed(4)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <Droplets className="h-5 w-5 text-blue-500 mb-1" />
                        <div className="text-sm text-muted-foreground">Humedad</div>
                        <div className="font-medium">{currentWeather.humidity.toFixed(0)}%</div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <Cloud className="h-5 w-5 text-slate-500 mb-1" />
                        <div className="text-sm text-muted-foreground">Precipitacion</div>
                        <div className="font-medium">{currentWeather.precipitation.toFixed(1)} mm</div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <Sun className="h-5 w-5 text-orange-500 mb-1" />
                        <div className="text-sm text-muted-foreground">Indice UV</div>
                        <div className="font-medium">{currentWeather.uvIndex.toFixed(0)}</div>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                        <Wind className="h-5 w-5 text-cyan-500 mb-1" />
                        <div className="text-sm text-muted-foreground">Viento</div>
                        <div className="font-medium">{currentWeather.windSpeed.toFixed(1)} km/h</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
