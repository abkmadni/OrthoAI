'use client'

import { useEffect, useRef } from 'react'

type Issue = {
  id: string
  label: string
  confidence: number
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface BoundingBoxCanvasProps {
  imageUrl: string
  issues: Issue[]
}

export default function BoundingBoxCanvas({ imageUrl, issues }: BoundingBoxCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const image = new Image()
    image.src = imageUrl
    
    image.onload = () => {
      // Responsive scaling
      const containerWidth = container.clientWidth
      const scale = containerWidth / image.naturalWidth
      
      canvas.width = containerWidth
      canvas.height = image.naturalHeight * scale

      // Draw Image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      // Draw Boxes
      issues.forEach(issue => {
        // Scale coordinates
        const x = issue.x * scale
        const y = issue.y * scale
        const w = issue.width * scale
        const h = issue.height * scale

        // Box Style
        ctx.strokeStyle = issue.color
        ctx.lineWidth = 3
        ctx.strokeRect(x, y, w, h)

        // Label Background
        ctx.fillStyle = issue.color
        ctx.font = 'bold 14px sans-serif'
        const text = `${issue.label} (${Math.round(issue.confidence * 100)}%)`
        const textMetrics = ctx.measureText(text)
        ctx.fillRect(x, y - 24, textMetrics.width + 10, 24)

        // Label Text
        ctx.fillStyle = 'white'
        ctx.fillText(text, x + 5, y - 7)
      })
    }
  }, [imageUrl, issues])

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-auto bg-black" />
    </div>
  )
}