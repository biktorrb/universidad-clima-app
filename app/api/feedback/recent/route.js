import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('universidad-clima')

    // Calculate date 7 days ago
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Get feedback from the last 7 days
    const recentFeedback = await db
      .collection("feedback")
      .find({
        timestamp: { $gte: sevenDaysAgo.toISOString() },
      })
      .sort({ timestamp: -1 })
      .toArray()

    // Calculate impact statistics
    const impactStats = {
      transport: 0,
      outdoor: 0,
      anxiety: 0,
      health: 0,
    }

    recentFeedback.forEach((item) => {
      if (item.impact && impactStats.hasOwnProperty(item.impact)) {
        impactStats[item.impact]++
      }
    })

    return NextResponse.json({
      feedback: recentFeedback,
      stats: impactStats,
      total: recentFeedback.length,
    })
  } catch (error) {
    console.error("Error fetching recent feedback:", error)
    return NextResponse.json({ error: "Failed to fetch recent feedback" }, { status: 500 })
  }
}
