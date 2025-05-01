import { NextResponse } from "next/server"
import { getWeatherStations } from "@/lib/weather-api"

export async function GET() {
  try {
    const stations = await getWeatherStations()

    return NextResponse.json(stations)
  } catch (error) {
    console.error("Error fetching weather stations:", error)
    return NextResponse.json({ error: "Failed to fetch weather stations" }, { status: 500 })
  }
}

