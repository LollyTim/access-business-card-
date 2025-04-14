import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { generateQRCodeUrl } from "@/lib/qr-code-api";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { fullName, position, phone, email, image } = data;

    if (!fullName || !position || !phone || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract username from email
    const username = email.split("@")[0].toLowerCase();

    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (image && image.startsWith("data:image/")) {
      try {
        console.log("Uploading image to Cloudinary...");
        imageUrl = await uploadImage(image);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    // Generate QR code URL
    const qrData = `${process.env.NEXT_PUBLIC_APP_URL}/${username}`;
    const qrCodeUrl = generateQRCodeUrl({
      data: qrData,
      size: 340,
      config: {
        body: "square",
        eye: "frame13",
        eyeBall: "ball13",
        erf1: ["fv"],
        erf2: ["fv"],
        erf3: ["fv"],
        brf1: ["fv"],
        brf2: ["fv"],
        brf3: ["fv"],
        bodyColor: "#000000",
        bgColor: "#FFFFFF",
        eye1Color: "#000000",
        eye2Color: "#000000",
        eye3Color: "#000000",
        eyeBall1Color: "#000000",
        eyeBall2Color: "#000000",
        eyeBall3Color: "#000000",
        logo: "/access-logo.png",
        logoMode: "clean",
      },
    });

    try {
      // First try to find an existing card
      const existingCard = await prisma.businessCard.findUnique({
        where: { email },
      });

      let businessCard;
      if (existingCard) {
        // Update existing card
        businessCard = await prisma.businessCard.update({
          where: { email },
          data: {
            fullName,
            position,
            phone,
            username,
            imageUrl,
            qrCodeUrl,
          },
        });
      } else {
        // Create new card
        businessCard = await prisma.businessCard.create({
          data: {
            fullName,
            position,
            phone,
            email,
            username,
            imageUrl,
            qrCodeUrl,
            downloads: 0,
          },
        });
      }

      return NextResponse.json(businessCard);
    } catch (error) {
      console.error("Database operation error:", error);
      return NextResponse.json(
        { error: "Failed to save business card" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating business card:", error);
    return NextResponse.json(
      { error: "Failed to create business card" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (username) {
      const businessCard = await prisma.businessCard.findUnique({
        where: { username },
      });

      if (!businessCard) {
        return NextResponse.json(
          { error: "Business card not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(businessCard);
    }

    const businessCards = await prisma.businessCard.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(businessCards);
  } catch (error) {
    console.error("Error fetching business cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch business cards" },
      { status: 500 }
    );
  }
}
