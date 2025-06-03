import { NextResponse } from "next/server"
import { saveFeedback, getAllFeedback } from "@/lib/models/feedback"

export async function GET() {
  try {
    // Obtiene todos los comentarios de mongo
    const feedback = await getAllFeedback()

    // Regresa todos los datos del comentario
    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    // Parse el request
    const data = await request.json()

    // Valida campos requeridos
    if (!data.impact || !data.career || !data.feedback || !data.suggestion) {
      return NextResponse.json({ error: "Debe llenar todos los campos" }, { status: 400 })
    }

    // Almacena comentario en mongo
    const result = await saveFeedback({
      impact: data.impact,
      career: data.career,
      feedback: data.feedback,
      suggestion: data.suggestion,
      timestamp: data.timestamp || new Date().toISOString(),
      weatherData: data.weatherData || null, 
      userAgent: request.headers.get("user-agent") || null,
    })

    // Regresa respuesta exitosa
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
