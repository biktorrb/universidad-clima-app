import { NextResponse } from "next/server"
import { saveFeedback, getAllFeedback } from "@/lib/models/feedback"

export async function GET() {
  try {
    // Get all feedback from MongoDB
    const feedback = await getAllFeedback()

    // Return the feedback data
    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json()

    // Validate required fields
    if (!data.impact || !data.career || !data.feedback || !data.suggestion) {
      return NextResponse.json({ error: "Debe llenar todos los campos" }, { status: 400 })
    }

    // Save feedback to MongoDB
    const result = await saveFeedback({
      impact: data.impact,
      career: data.career,
      feedback: data.feedback,
      suggestion: data.suggestion,
      timestamp: data.timestamp || new Date().toISOString(),
      weatherData: data.weatherData || null, // Optional weather data
      userAgent: request.headers.get("user-agent") || null,
    })

    // Return success response
    return NextResponse.json({
      success: true,
      message: "¡Se ha enviado tu comentario satisfactoriamente!",
      id: result.id,
    })
  } catch (error) {
    console.error("Error procesando tu comentario:", error)
    return NextResponse.json({ error: "Fallo al enviar tu comentario" }, { status: 500 })
  }
}
