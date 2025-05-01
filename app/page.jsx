import { Suspense } from "react"
import WeatherDashboard from "@/components/weather-dashboard"
import FeedbackForm from "@/components/feedback-form"
import CampusMap from "@/components/campus-map"
import WeatherAlerts from "@/components/weather-alerts"
import WeatherRecommendations from "@/components/weather-recommendations"
import FeedbackWall from "@/components/feedback-wall"
import FeedbackAdmin from "@/components/admin-feedback"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl md:text-3xl">Monitor Ambiental - UNEFA Zaraza</CardTitle>
          <CardDescription>Monitoreamos el impacto que causan los cambio ambientales en los estudiantes de la UNEFA Zaraza.</CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<Skeleton className="w-full h-[200px] rounded-lg" />}>
        <WeatherAlerts />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mt-6">
        <div className="md:col-span-2 lg:col-span-3">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Panel de Monitoreo</TabsTrigger>
              <TabsTrigger value="map">Map de la universidad</TabsTrigger>
              <TabsTrigger value="feedback">Envia tus comentarios</TabsTrigger>
              <TabsTrigger value="wall">Comentarios y Analisis</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}>
                <WeatherDashboard />
              </Suspense>
            </TabsContent>
            <TabsContent value="map">
              <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}>
                <CampusMap />
              </Suspense>
            </TabsContent>
            <TabsContent value="feedback">
              <FeedbackForm />
            </TabsContent>
            <TabsContent value="wall">
              <Suspense fallback={<Skeleton className="w-full h-[400px] rounded-lg" />}>
                <FeedbackWall />
              </Suspense>
            </TabsContent>
            {/* <TabsContent value="feedback-admin">
              <FeedbackAdmin />
            </TabsContent> */}
          </Tabs>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="w-full h-[200px] rounded-lg" />}>
                <WeatherRecommendations />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

// function WeatherRecommendations() {
  // // In a real app, this would be based on actual weather data from Open-Meteo
  // return (
    // <div className="space-y-4">
      {/* <div className="flex items-start gap-2"> */}
        {/* <div className="bg-yellow-100 p-2 rounded-full"> */}
          {/* <span className="text-yellow-700">☂️</span> */}
        {/* </div> */}
        {/* <div> */}
          {/* <h3 className="font-medium">Bring an umbrella</h3> */}
          {/* <p className="text-sm text-muted-foreground">Check the precipitation forecast</p> */}
        {/* </div> */}
      {/* </div> */}
      {/* <div className="flex items-start gap-2"> */}
        {/* <div className="bg-blue-100 p-2 rounded-full"> */}
          {/* <span className="text-blue-700">🧥</span> */}
        {/* </div> */}
        {/* <div> */}
          {/* <h3 className="font-medium">Dress appropriately</h3> */}
          {/* <p className="text-sm text-muted-foreground">Based on current temperature</p> */}
        {/* </div> */}
      {/* </div> */}
      {/* <div className="flex items-start gap-2"> */}
        {/* <div className="bg-red-100 p-2 rounded-full"> */}
          {/* <span className="text-red-700">🌞</span> */}
        {/* </div> */}
        {/* <div> */}
          {/* <h3 className="font-medium">Use sun protection</h3> */}
          {/* <p className="text-sm text-muted-foreground">UV index may be high during the day</p> */}
        {/* </div> */}
      {/* </div> */}
    {/* </div> */}
  // )
// }

