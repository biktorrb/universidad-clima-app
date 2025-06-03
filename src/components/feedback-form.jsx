"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SimpleSelect } from "@/components/ui/select"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentWeather } from "@/lib/weather-api"

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false)
  const [impact, setImpact] = useState("")
  const [career, setCareer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [errors, setErrors] = useState({
    impact: false,
    career: false,
    feedback: false,
    suggestion: false,
    general: null,
  })

  // Opciones de carrera
  const careerOptions = [
    { value: "ingenieria-sistemas", label: "Ingenieria de Sistemas" },
    { value: "ingenieria-electrica", label: "Ingenieria Electrica" },
    { value: "contaduria-publica", label: "Contaduria Publica" },
    { value: "enfermeria", label: "Enfermeria" },
  ]

  // Obtiene clima actual
  useEffect(() => {
    async function fetchWeather() {
      try {
        const weatherData = await getCurrentWeather()
        setCurrentWeather(weatherData)
      } catch (error) {
        console.error("Error cargando el clima actual:", error)
        // Non-critical error, don't show to user
      }
    }

    fetchWeather()
  }, [])

  const validateForm = () => {
    const newErrors = {
      impact: !impact,
      feedback: !feedback.trim(),
      suggestion: !suggestion.trim(),
      general: null,
    }

    setErrors(newErrors)

    return !Object.values(newErrors).some((error) => error === true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Valida todos los campos
    if (!validateForm()) {
      setErrors((prev) => ({
        ...prev,
        general: "Por favor, rellena todos los campos.",
      }))
      return
    }

    try {
      setIsSubmitting(true)
      setErrors((prev) => ({ ...prev, general: null }))


      const selectedCareer = careerOptions.find((option) => option.value === career)

      // Preparacion de los datos
      const feedbackData = {
        impact,
        career: selectedCareer ? selectedCareer.label : career,
        feedback,
        suggestion,
        timestamp: new Date().toISOString(),
        weatherData: currentWeather, 
      }

      // Envio de datos a la api
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al enviar comentario")
      }

      // Manejo de envio de envio exitiso
      setSubmitted(true)
    } catch (err) {
      console.error("Error al enviar comentario:", err)
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Error al enviar comentario, intente nuevamente.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitted(false)
    setImpact("")
    setCareer("")
    setFeedback("")
    setSuggestion("")
    setErrors({
      impact: false,
      career: false,
      feedback: false,
      suggestion: false,
      general: null,
    })
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[400px] text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">¡Gracias!</h2>
          <p className="text-muted-foreground">
            Tu comentario fue enviado satisfactoriamente. Estos mensajes nos ayudan a crear estrategias para mejorar la experiencia de los estudiantes.
          </p>
          <Button className="mt-6" onClick={resetForm}>
            Enviar otro comentario
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentario sobre el impacto ambiental</CardTitle>
        <CardDescription>Comparte como el clima de hoy esta afectando tu experiencia en la universidad</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>¿Como ha afectado el clima tu dia?</Label>
              {errors.impact && <span className="text-sm text-destructive">Requerido</span>}
            </div>
            <RadioGroup value={impact} onValueChange={setImpact} className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Label
                htmlFor="transport"
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 [&:has(:checked)]:bg-muted ${errors.impact ? "border-destructive" : ""}`}
              >
                <RadioGroupItem value="transport" id="transport" />
                <span>Retraso en el transporte</span>
              </Label>
              <Label
                htmlFor="outdoor"
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 [&:has(:checked)]:bg-muted ${errors.impact ? "border-destructive" : ""}`}
              >
                <RadioGroupItem value="outdoor" id="outdoor" />
                <span>Actividades en exteriores limitadas</span>
              </Label>
              <Label
                htmlFor="anxiety"
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 [&:has(:checked)]:bg-muted ${errors.impact ? "border-destructive" : ""}`}
              >
                <RadioGroupItem value="anxiety" id="anxiety" />
                <span>Incremento de ansiedad</span>
              </Label>
              <Label
                htmlFor="health"
                className={`flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50 [&:has(:checked)]:bg-muted ${errors.impact ? "border-destructive" : ""}`}
              >
                <RadioGroupItem value="health" id="health" />
                <span>Problemas de salud (Refriado/Golpe de calor/Otros)</span>
              </Label>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="career">¿Que carrera estudias?</Label>
              {errors.career && <span className="text-sm text-destructive">Requerido</span>}
            </div>
            <SimpleSelect
              value={career}
              onValueChange={setCareer}
              placeholder="Selecciona la Carrera"
              options={careerOptions}
              className={errors.career ? "border-destructive" : ""}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="feedback">Cuentanos mas sobre tu experiencia</Label>
              {errors.feedback && <span className="text-sm text-destructive">Requeridad</span>}
            </div>
            <Textarea
              id="feedback"
              placeholder="Por ejemplo: Llegue 20 minutos tarde a la universidad debido a las fuertes lluvias"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className={errors.feedback ? "border-destructive" : ""}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="suggestion">¿Tienes alguna recomendación para la universidad?</Label>
              {errors.suggestion && <span className="text-sm text-destructive">Requerido</span>}
            </div>
            <Textarea
              id="suggestion"
              placeholder="Por ejemplo: Me gustaria que la universidad contara con transporte propio para evitar retrasos en el transporte publico."
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={3}
              className={errors.suggestion ? "border-destructive" : ""}
            />
          </div>

          {currentWeather && (
            <div className="text-xs text-muted-foreground">
              Clima Actual: {currentWeather.temperature.toFixed(1)}°C, {currentWeather.condition}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Comentario"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

