import clientPromise from "../mongodb"

export async function saveFeedback(feedbackData) {
  try {
    const client = await clientPromise
    const db = client.db('universidad-clima')

    if (!feedbackData.timestamp) {
      feedbackData.timestamp = new Date().toISOString()
    }

    const result = await db.collection("feedback").insertOne(feedbackData)

    return {
      success: true,
      id: result.insertedId,
      data: feedbackData,
    }
  } catch (error) {
    console.error("Error saving feedback to MongoDB:", error)
    throw new Error("Failed to save feedback to database")
  }
}

export async function getAllFeedback() {
  try {
    const client = await clientPromise
    const db = client.db('universidad-clima')

    const feedback = await db
      .collection("feedback")
      .find({})
      .sort({ timestamp: -1 }) 
      .toArray()

    return feedback
  } catch (error) {
    console.error("Error fetching feedback from MongoDB:", error)
    throw new Error("Failed to fetch feedback from database")
  }
}

