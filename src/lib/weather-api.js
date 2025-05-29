const LATITUDE = 9.3468229
const LONGITUDE = -65.3365034

// Helper function to determine weather condition based on WMO codes
function getWeatherCondition(weatherCode) {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  switch (true) {
    case weatherCode === 0:
      return "Despejado"
    case weatherCode === 1:
      return "Mayormente Despejado"
    case weatherCode === 2:
      return "Parcialmente Nublado"
    case weatherCode === 3:
      return "Nublado"
    case weatherCode >= 45 && weatherCode <= 48:
      return "Neblina"
    case weatherCode >= 51 && weatherCode <= 55:
      return "Llovizna"
    case weatherCode >= 56 && weatherCode <= 57:
      return "Llovizna Helada"  // Congelante → Helada
    case weatherCode >= 61 && weatherCode <= 65:
      return "Lluvia"           // Rain
    case weatherCode >= 66 && weatherCode <= 67:
      return "Lluvia Helada"   // Freezing Rain
    case weatherCode >= 71 && weatherCode <= 77:
      return "Nieve"            // Snow
    case weatherCode >= 80 && weatherCode <= 82:
      return "Chubascos"        // Rain Showers
    case weatherCode >= 85 && weatherCode <= 86:
      return "Nevadas"          // Snow Showers
    case weatherCode >= 95 && weatherCode <= 99:
      return "Tormenta Eléctrica" // Thunderstorm
    default:
      return "Desconocido"
}
}

export async function getCurrentWeather() {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=uv_index`
    )

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Get the current UV index from the first hourly value
    const currentUvIndex = data.hourly.uv_index[0] || 0

    return {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      precipitation: data.current.precipitation,
      condition: getWeatherCondition(data.current.weather_code),
      uvIndex: currentUvIndex,
      windSpeed: data.current.wind_speed_10m,
    }
  } catch (error) {
    console.error("Error fetching current weather:", error)
    throw error
  }
}

export async function getHourlyForecast(hours = 48) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&hourly=temperature_2m,precipitation,weather_code&forecast_hours=${hours}`,
    )

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`)
    }

    const data = await response.json()
    const forecast = []

    for (let i = 0; i < Math.min(hours, data.hourly.time.length); i++) {
      forecast.push({
        time: new Date(data.hourly.time[i]),
        temperature: data.hourly.temperature_2m[i],
        precipitation: data.hourly.precipitation[i],
        condition: getWeatherCondition(data.hourly.weather_code[i]),
      })
    }

    return forecast
  } catch (error) {
    console.error("Error fetching hourly forecast:", error)
    throw error
  }
}

export async function getWeatherAlerts() {
  try {
    // Open-Meteo doesn't provide alerts directly, so we'll generate them based on forecast data
    const forecast = await getHourlyForecast(24)
    const alerts = []

    // Check for high temperatures
    const maxTemp = Math.max(...forecast.map((f) => f.temperature))
    if (maxTemp > 30) {
      alerts.push({
        id: 1,
        type: "warning",
        title: "Alerta de Temperaturas Altas",
        description: `Se espera que la temperatura alcance los ${maxTemp.toFixed(1)}°C hoy. Mantente hidratado y evita exponerte al sol por mucho tiempo.`,
      })
    }

    // Check for heavy precipitation
    const maxPrecip = Math.max(...forecast.map((f) => f.precipitation))
    if (maxPrecip > 5) {
      alerts.push({
        id: 2,
        type: "severe",
        title: "Se prevén fuertes lluvias",
        description: `Se esperan fuertes lluvias de hasta ${maxPrecip.toFixed(1)}mm. Considera llevar contigo un paraguas, y toma previsiones para evitar retrasos.`,
      })
    }

    // Check for UV index
    const currentWeather = await getCurrentWeather()
    if (currentWeather.uvIndex > 8) {
      alerts.push({
        id: 3,
        type: "warning",
        title: "Indice UV Alto",
        description: `El indice UV es muy alto: (${currentWeather.uvIndex}). Usa protector solar y ponte ropa que te proteja contra los rayos del sol si planeas pasa tiempo al aire libre.`,
      })
    }

    return alerts
  } catch (error) {
    console.error("Error al generar alertas:", error)
    return []
  }
}

export async function getWeatherStations() {
  // Since we're using a single weather source, we'll create virtual "stations" around the main coordinates

  try {
    const mainWeather = await getCurrentWeather()

    // Create virtual stations with slight variations from the main weather
    return [
      {
        id: 1,
        name: "Main Campus",
        location: { x: 30, y: 40 },
        temperature: mainWeather.temperature,
        condition: mainWeather.condition,
        humidity: mainWeather.humidity,
        coordinates: { lat: LATITUDE, lng: LONGITUDE },
      },
      {
        id: 2,
        name: "Science Building",
        location: { x: 60, y: 30 },
        temperature: mainWeather.temperature + (Math.random() * 2 - 1),
        condition: mainWeather.condition,
        humidity: mainWeather.humidity + (Math.random() * 5 - 2.5),
        coordinates: { lat: LATITUDE + 0.01, lng: LONGITUDE + 0.01 },
      },
      {
        id: 3,
        name: "Student Center",
        location: { x: 45, y: 70 },
        temperature: mainWeather.temperature + (Math.random() * 2 - 1),
        condition: mainWeather.condition,
        humidity: mainWeather.humidity + (Math.random() * 5 - 2.5),
        coordinates: { lat: LATITUDE - 0.01, lng: LONGITUDE - 0.01 },
      },
      {
        id: 4,
        name: "Sports Complex",
        location: { x: 80, y: 60 },
        temperature: mainWeather.temperature + (Math.random() * 2 - 1),
        condition: mainWeather.condition,
        humidity: mainWeather.humidity + (Math.random() * 5 - 2.5),
        coordinates: { lat: LATITUDE + 0.02, lng: LONGITUDE - 0.01 },
      },
      {
        id: 5,
        name: "Library",
        location: { x: 20, y: 60 },
        temperature: mainWeather.temperature + (Math.random() * 2 - 1),
        condition: mainWeather.condition,
        humidity: mainWeather.humidity + (Math.random() * 5 - 2.5),
        coordinates: { lat: LATITUDE - 0.02, lng: LONGITUDE + 0.01 },
      },
    ]
  } catch (error) {
    console.error("Error creating weather stations:", error)
    return []
  }
}

