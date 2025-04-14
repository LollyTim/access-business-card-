import { NextRequest, NextResponse } from "next/server";

const QR_CODE_MONKEY_API = "https://api.qrcode-monkey.com/qr/custom";

/**
 * This is a server-side API route that generates QR codes with custom styling using QR Code Monkey API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const data = searchParams.get("data");
    const size = searchParams.get("size");
    const config = searchParams.get("config");
    const file = searchParams.get("file");
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    if (!data) {
      return new NextResponse("Missing required data parameter", {
        status: 400,
      });
    }

    // Parse the config and update the logo URL to be absolute
    let configObj = config ? JSON.parse(config) : {};
    if (configObj.logo && configObj.logo.startsWith("/")) {
      configObj.logo = `${protocol}://${host}${configObj.logo}`;
    }

    // Replace localhost URLs in the data with production URLs
    const normalizedData = data.replace(
      /(http:\/\/|https:\/\/)localhost(:\d+)?/g,
      `${protocol}://${host}`
    );

    const requestBody = {
      data: normalizedData,
      size: size ? parseInt(size) : 340,
      config: configObj,
      file: file || "png",
      download: false,
    };

    // Forward the request to QR Code Monkey API
    const response = await fetch(QR_CODE_MONKEY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("QR Code API Error:", {
        status: response.status,
        body: errorText,
        requestBody,
      });
      return new NextResponse(
        `Failed to generate QR code: ${response.status} ${errorText}`,
        { status: response.status }
      );
    }

    // Forward the QR code image with appropriate headers
    const buffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.headers.get("Content-Type") || "image/png"
    );
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("QR Code Generation Error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
