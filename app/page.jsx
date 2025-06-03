import { Suspense } from "react"
import WeatherDashboard from "@/components/weather-dashboard"
import FeedbackForm from "@/components/feedback-form"
import CampusMap from "@/components/campus-map"
import WeatherAlerts from "@/components/weather-alerts"
import WeatherRecommendations from "@/components/weather-recommendations"
import FeedbackWall from "@/components/feedback-wall"
import Footer from "@/components/footer"
import UniversityLogo from "@/components/university-logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-8 py-6">
        <UniversityLogo className="mb-3" />
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Monitoreamos como impacta las condiciones climaticas la experiencia de los estudiantes de la UNEFA Extensión Zaraza.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="w-full h-[200px] rounded-lg" />}>
        <WeatherAlerts />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mt-6">
        <div className="md:col-span-2 lg:col-span-3">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-5">
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
      <Footer/>
    </main>
  )
}

