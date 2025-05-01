import { getAllFeedback } from "@/lib/models/feedback"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic" // Don't cache this page

export default async function FeedbackAdmin() {
  let feedback = []
  let error = null

  try {
    feedback = await getAllFeedback()
  } catch (err) {
    error = "Failed to load feedback data"
    console.error(error, err)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Weather Feedback Admin</h1>

      {error ? (
        <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
      ) : feedback.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No feedback submissions yet.</div>
      ) : (
        <div className="grid gap-4">
          {feedback.map((item) => (
            <Card key={item._id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Impact: {item.impact}</CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  {item.weatherData && (
                    <div className="text-sm text-muted-foreground">
                      {item.weatherData.temperature.toFixed(1)}°C, {item.weatherData.condition}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm">Feedback:</h3>
                    <p className="mt-1">{item.feedback}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Suggestion:</h3>
                    <p className="mt-1">{item.suggestion}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

