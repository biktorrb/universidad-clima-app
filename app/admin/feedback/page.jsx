"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SimpleSelect } from "@/components/ui/select"
import { Download, Filter, Search } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState([])
  const [filteredFeedback, setFilteredFeedback] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    career: "all",
    impact: "all",
  })

  // Filter options
  const careerOptions = [
    { value: "all", label: "All Careers" },
    { value: "Ingenieria de Sistemas", label: "Ingenieria de Sistemas" },
    { value: "Ingenieria Electrica", label: "Ingenieria Electrica" },
    { value: "Contaduria Publica", label: "Contaduria Publica" },
    { value: "Enfermeria", label: "Enfermeria" },
  ]

  const impactOptions = [
    { value: "all", label: "All Impacts" },
    { value: "transport", label: "Transportation delays" },
    { value: "outdoor", label: "Limited outdoor activities" },
    { value: "anxiety", label: "Increased anxiety" },
    { value: "health", label: "Health issues" },
  ]

  useEffect(() => {
    fetchFeedback()
  }, [])

  useEffect(() => {
    // Apply filters and search
    let filtered = feedback

    // Filter by career
    if (filters.career !== "all") {
      filtered = filtered.filter((item) => item.career === filters.career)
    }

    // Filter by impact
    if (filters.impact !== "all") {
      filtered = filtered.filter((item) => item.impact === filters.impact)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.suggestion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.career?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredFeedback(filtered)
  }, [feedback, filters, searchTerm])

  const fetchFeedback = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/feedback")

      if (response.ok) {
        const data = await response.json()
        setFeedback(data)
        setError("")
      } else {
        setError("Failed to fetch feedback")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    const headers = ["Date", "Time", "Career", "Impact", "Feedback", "Suggestion", "Weather"]
    const csvContent = [
      headers.join(","),
      ...filteredFeedback.map((item) =>
        [
          format(new Date(item.timestamp), "yyyy-MM-dd"),
          format(new Date(item.timestamp), "HH:mm:ss"),
          `"${item.career || ""}"`,
          `"${item.impact || ""}"`,
          `"${item.feedback?.replace(/"/g, '""') || ""}"`,
          `"${item.suggestion?.replace(/"/g, '""') || ""}"`,
          `"${item.weatherData ? `${item.weatherData.temperature}°C, ${item.weatherData.condition}` : ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `feedback-export-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getCareerColor = (career) => {
    switch (career) {
      case "Ingenieria de Sistemas":
        return "bg-sky-blue-100 text-sky-blue-800 dark:bg-sky-blue-900/30 dark:text-sky-blue-300"
      case "Ingenieria Electrica":
        return "bg-sun-100 text-sun-800 dark:bg-sun-900/30 dark:text-sun-300"
      case "Contaduria Publica":
        return "bg-leaf-100 text-leaf-800 dark:bg-leaf-900/30 dark:text-leaf-300"
      case "Enfermeria":
        return "bg-rain-100 text-rain-800 dark:bg-rain-900/30 dark:text-rain-300"
      default:
        return "bg-cloud-100 text-cloud-800 dark:bg-cloud-900/30 dark:text-cloud-300"
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case "transport":
        return "bg-blue-100 text-blue-800"
      case "outdoor":
        return "bg-green-100 text-green-800"
      case "anxiety":
        return "bg-purple-100 text-purple-800"
      case "health":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Feedback Management</h1>
        <p className="text-muted-foreground">View and manage all weather feedback submissions</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Career</Label>
              <SimpleSelect
                value={filters.career}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, career: value }))}
                options={careerOptions}
                placeholder="Select career"
              />
            </div>
            <div>
              <Label>Impact</Label>
              <SimpleSelect
                value={filters.impact}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, impact: value }))}
                options={impactOptions}
                placeholder="Select impact"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={exportData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredFeedback.length}</div>
            <p className="text-xs text-muted-foreground">Total Submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {new Set(filteredFeedback.map((f) => f.career).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">Different Careers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {
                filteredFeedback.filter((f) => new Date(f.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Last 7 Days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {
                filteredFeedback.filter((f) => new Date(f.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000))
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">Last 24 Hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `Showing ${filteredFeedback.length} of ${feedback.length} submissions`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading feedback data...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredFeedback.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No feedback submissions found with the current filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((item) => (
                <Card key={item._id} className="border-l-4 border-l-sky-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.career && (
                          <Badge variant="outline" className={getCareerColor(item.career)}>
                            {item.career}
                          </Badge>
                        )}
                        {item.impact && (
                          <Badge variant="outline" className={getImpactColor(item.impact)}>
                            {item.impact}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>{format(new Date(item.timestamp), "PPP")}</div>
                        <div>{format(new Date(item.timestamp), "p")}</div>
                        <div className="text-xs">
                          {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Feedback:</h4>
                        <p className="text-sm">{item.feedback}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-1">Suggestion:</h4>
                        <p className="text-sm">{item.suggestion}</p>
                      </div>

                      {item.weatherData && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                          Weather at submission: {item.weatherData.temperature?.toFixed(1)}°C,{" "}
                          {item.weatherData.condition}
                          {item.weatherData.humidity && ` • Humidity: ${item.weatherData.humidity.toFixed(0)}%`}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
