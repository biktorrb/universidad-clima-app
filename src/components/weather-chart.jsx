"use client"

import { useEffect, useRef } from "react"

export default function WeatherChart({ data, yLabel, color }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpia el canva
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Seteo de dimensiones
    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Encuentra valor minimo y maximo
    const values = data.map((d) => d.value)
    const maxValue = Math.max(...values) * 1.1 
    const minValue = Math.min(0, Math.min(...values) * 0.9) 

    // Dibuja ejes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Dibuja label en el eje y
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    const ySteps = 5
    for (let i = 0; i <= ySteps; i++) {
      const y = padding + (chartHeight * i) / ySteps
      const value = maxValue - ((maxValue - minValue) * i) / ySteps
      ctx.fillText(value.toFixed(1), padding - 10, y)

      
      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0"
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Dibuja label en el eje x
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    // Agrupa por fecha
    const dateGroups = data.reduce((acc, d) => {
      if (!acc[d.date]) {
        acc[d.date] = []
      }
      acc[d.date].push(d)
      return acc
    }, {})

    // Separadores por fecha
    let currentX = padding
    Object.entries(dateGroups).forEach(([date, points], dateIndex) => {
      const dateWidth = (chartWidth / data.length) * points.length
      const dateMiddle = currentX + dateWidth / 2

      // Etiqueta de fecha
      ctx.fillText(date, dateMiddle, height - padding + 15)

      // Separadaroes por fecha
      if (dateIndex > 0) {
        ctx.beginPath()
        ctx.strokeStyle = "#cbd5e1"
        ctx.setLineDash([5, 5])
        ctx.moveTo(currentX, padding)
        ctx.lineTo(currentX, height - padding)
        ctx.stroke()
        ctx.setLineDash([])
      }

      currentX += dateWidth
    })

    // Draw line chart
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    data.forEach((d, i) => {
      const x = padding + (i * chartWidth) / (data.length - 1)
      const y = padding + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    data.forEach((d, i) => {
      const x = padding + (i * chartWidth) / (data.length - 1)
      const y = padding + chartHeight - ((d.value - minValue) / (maxValue - minValue)) * chartHeight

      ctx.beginPath()
      ctx.fillStyle = "white"
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.stroke()
    })

    ctx.save()
    ctx.translate(15, height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = "center"
    ctx.fillText(yLabel, 0, 0)
    ctx.restore()
  }, [data, yLabel, color])

  return <canvas ref={canvasRef} width={800} height={300} className="w-full h-auto" />
}

