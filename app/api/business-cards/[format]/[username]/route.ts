import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ format: string; username: string }> }
) {
  try {
    const { format, username } = await params;
    const businessCard = await prisma.businessCard.findUnique({
      where: { username },
    });

    if (!businessCard) {
      return new NextResponse("Business card not found", { status: 404 });
    }

    // Increment downloads counter
    await prisma.businessCard.update({
      where: { id: businessCard.id },
      data: { downloads: { increment: 1 } },
    });

    if (format === "pdf") {
      // Create PDF with business card dimensions (90x50mm)
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [90, 50],
      });

      // Set background color
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 90, 50, "F");

      // Add Access Bank branding color
      doc.setTextColor(255, 87, 34); // #FF5722

      // Add name
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(businessCard.fullName, 10, 15);

      // Add position
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(businessCard.position, 10, 22);

      // Add contact details
      doc.setFontSize(10);
      doc.text(`M ${businessCard.phone}`, 10, 30);
      doc.text(`E ${businessCard.email}`, 10, 35);

      // Add company website
      doc.setTextColor(255, 87, 34);
      doc.text("www.accessbankplc.com", 10, 40);

      // Add company address
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        "Head Office: 14/15 Prince Alana Abiodun, Oniru Street,",
        10,
        44
      );
      doc.text("Oniru Estate, Victoria Island. Lagos, Nigeria", 10, 47);

      // Add QR Code if available
      if (businessCard.qrCodeUrl) {
        const qrCodeUrl = `${process.env.NEXT_PUBLIC_APP_URL}${businessCard.qrCodeUrl}`;
        doc.addImage(qrCodeUrl, "PNG", 65, 15, 20, 20);
      }

      // Convert to ArrayBuffer
      const pdfBuffer = doc.output("arraybuffer");

      // Return PDF with proper headers
      const headers = new Headers();
      headers.set("Content-Type", "application/pdf");
      headers.set(
        "Content-Disposition",
        `attachment; filename="${businessCard.username}-business-card.pdf"`
      );

      return new NextResponse(pdfBuffer, { headers });
    } else if (format === "vcard") {
      // Generate vCard format
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${businessCard.fullName}`,
        `FN:${businessCard.fullName}`,
        `TITLE:${businessCard.position}`,
        `TEL:${businessCard.phone}`,
        `EMAIL:${businessCard.email}`,
        "ORG:Access Bank PLC",
        "ADR:;;14/15 Prince Alana Abiodun\\, Oniru Street\\,;Oniru Estate\\, Victoria Island;Lagos;;Nigeria",
        "URL:https://www.accessbankplc.com",
        "END:VCARD",
      ].join("\n");

      const headers = new Headers();
      headers.set("Content-Type", "text/vcard");
      headers.set(
        "Content-Disposition",
        `attachment; filename="${businessCard.username}.vcf"`
      );

      return new NextResponse(vcard, { headers });
    }

    return new NextResponse("Invalid format", { status: 400 });
  } catch (error) {
    console.error("Error generating business card:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
