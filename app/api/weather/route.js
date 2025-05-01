import { NextResponse } from "next/server"
import { getCurrentWeather, getHourlyForecast, getWeatherAlerts } from "@/lib/weather-api"

export async function GET() {
  try {
    const currentWeather = await getCurrentWeather()
    const hourlyForecast = await getHourlyForecast()
    const alerts = await getWeatherAlerts()

    return NextResponse.json({
      current: currentWeather,
      hourly: hourlyForecast,
      alerts,
    })
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}

