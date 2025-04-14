"use client"

import { useEffect, useState } from "react"
import { generateQRCodeUrl } from "@/lib/qr-code-api"

interface QRCodeGeneratorProps {
  data: string
  size?: number
  logoUrl?: string
  logoSize?: number
  qrColor?: string
  backgroundColor?: string
}

export function QRCodeGenerator({
  data,
  size = 200,
  logoUrl,
  logoSize = 15,
  qrColor = "000000",
  backgroundColor = "FFFFFF",
}: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    // Generate QR code URL using the QR Code Monkey API
    const url = generateQRCodeUrl({
      data,
      size,
      logoImage: logoUrl,
      logoSize,
      qrColor,
      bgColor: backgroundColor,
      logoMode: "2", // 2 means the logo will be placed in the center with a clear background
    })

    setQrCodeUrl(url)
  }, [data, size, logoUrl, logoSize, qrColor, backgroundColor])

  return (
    <div className="flex flex-col items-center">
      <div className="overflow-hidden rounded-md border border-gray-200">
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl || "/placeholder.svg"}
            alt={`QR Code for ${data}`}
            width={size}
            height={size}
            className="h-auto w-full"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 p-4 text-sm text-gray-500">
            Generating QR code...
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500">QR Code for: {data}</p>
    </div>
  )
}
