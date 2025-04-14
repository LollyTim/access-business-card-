"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  url: string
  size?: number
  logoUrl?: string
}

export function QRCodeGenerator({ url, size = 128, logoUrl }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return

      // This is a simplified representation
      // In a real implementation, you would use a QR code generation library
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, size, size)

      // Draw QR code pattern (simplified)
      ctx.fillStyle = "black"

      // Draw position detection patterns (corners)
      // Top-left
      ctx.fillRect(10, 10, 30, 30)
      ctx.fillStyle = "white"
      ctx.fillRect(15, 15, 20, 20)
      ctx.fillStyle = "black"
      ctx.fillRect(20, 20, 10, 10)

      // Top-right
      ctx.fillRect(size - 40, 10, 30, 30)
      ctx.fillStyle = "white"
      ctx.fillRect(size - 35, 15, 20, 20)
      ctx.fillStyle = "black"
      ctx.fillRect(size - 30, 20, 10, 10)

      // Bottom-left
      ctx.fillRect(10, size - 40, 30, 30)
      ctx.fillStyle = "white"
      ctx.fillRect(15, size - 35, 20, 20)
      ctx.fillStyle = "black"
      ctx.fillRect(20, size - 30, 10, 10)

      // Draw random QR code-like pattern
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() > 0.7) {
            ctx.fillRect(10 + i * 6, 10 + j * 6, 4, 4)
          }
        }
      }

      // Draw logo in center if provided
      if (logoUrl) {
        const logo = new Image()
        logo.crossOrigin = "anonymous"
        logo.onload = () => {
          const logoSize = size / 4
          const x = (size - logoSize) / 2
          const y = (size - logoSize) / 2

          // Clear background for logo
          ctx.fillStyle = "white"
          ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)

          // Draw logo
          ctx.drawImage(logo, x, y, logoSize, logoSize)
        }
        logo.src = logoUrl
      } else {
        // Draw Access Bank logo
        const centerX = size / 2
        const centerY = size / 2
        const logoSize = size / 8

        // Draw diamond shape
        ctx.fillStyle = "#FF5722"
        ctx.beginPath()
        ctx.moveTo(centerX, centerY - logoSize)
        ctx.lineTo(centerX + logoSize, centerY)
        ctx.lineTo(centerX, centerY + logoSize)
        ctx.lineTo(centerX - logoSize, centerY)
        ctx.closePath()
        ctx.fill()
      }
    }

    generateQRCode()
  }, [url, size, logoUrl])

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-md" />
}
