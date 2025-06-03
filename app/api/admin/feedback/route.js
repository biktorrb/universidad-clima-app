import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    // Verify admin authentication
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 10
    const career = searchParams.get("career")
    const impact = searchParams.get("impact")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const client = await clientPromise
    const db = client.db('universidad-clima')

    // Filtro de consulta
    const filter = {}

    if (career && career !== "all") {
      filter.career = career
    }

    if (impact && impact !== "all") {
      filter.impact = impact
    }

    if (startDate || endDate) {
      filter.timestamp = {}
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate).toISOString()
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate).toISOString()
      }
    }

    // Obtiene cuenta para paginación
    const totalCount = await db.collection("feedback").countDocuments(filter)

    // Obtiene feedback paginado
    const feedback = await db
      .collection("feedback")
      .find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Suma de estadisticas
    const stats = await db
      .collection("feedback")
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalSubmissions: { $sum: 1 },
            byCareer: {
              $push: "$career",
            },
            byImpact: {
              $push: "$impact",
            },
          },
        },
      ])
      .toArray()

    // Procesa estadisticas de carrera e impacto
    const careerStats = {}
    const impactStats = {}

    if (stats.length > 0) {
      stats[0].byCareer.forEach((career) => {
        careerStats[career] = (careerStats[career] || 0) + 1
      })

      stats[0].byImpact.forEach((impact) => {
        impactStats[impact] = (impactStats[impact] || 0) + 1
      })
    }

    return NextResponse.json({
      feedback,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
      },
      statistics: {
        total: totalCount,
        careerBreakdown: careerStats,
        impactBreakdown: impactStats,
      },
    })
  } catch (error) {
    console.error("Error fetching admin feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback data" }, { status: 500 })
  }
}
