import jsPDF from "jspdf";
import type { BusinessCard } from "@/types/business-card";

// Professional business card dimensions (standard size: 85x55mm)
const CARD_WIDTH = 115;
const CARD_HEIGHT = 65;

// Professional scale factor for consistent sizing across all elements
const SCALE_FACTOR = 1;

// Standard text sizes for professional typography
const TEXT_SIZES = {
  name: 14 * SCALE_FACTOR, // Name (largest)
  position: 12 * SCALE_FACTOR, // Position/title
  address: 11 * SCALE_FACTOR, // Address text
  contact: 10 * SCALE_FACTOR, // Contact information
  website: 10 * SCALE_FACTOR, // Website URL
  slogan: 14 * SCALE_FACTOR, // Back of card slogan
};

// Professional spacing values
const SPACING = {
  margin: 5 * SCALE_FACTOR, // Standard margin
  contactSpacing: 4 * SCALE_FACTOR, // Space between contact elements
  addressSpacing: 8 * SCALE_FACTOR, // Space after address
};

// Professional color palette (Access Bank colors)
const COLORS = {
  orange: [255, 87, 34] as [number, number, number], // Access Bank Orange
  blue: [0, 57, 203] as [number, number, number], // Access Bank Blue
  black: [0, 0, 0] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

export async function generateBusinessCardPDF(
  businessCard: BusinessCard,
  qrCodeUrl: string
) {
  // Create a new PDF document with professional settings
  const doc = new jsPDF({
    unit: "mm",
    format: [CARD_WIDTH, CARD_HEIGHT],
    orientation: "landscape",
    compress: true,
    precision: 16,
    putOnlyUsedFonts: true,
  });

  // Function to create front of card
  const createFrontPage = async () => {
    // Set white background
    doc.setFillColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, "F");

    // Add Access Bank logo with professional positioning
    try {
      const response = await fetch("/access-logo.png");
      const blob = await response.blob();
      const logoDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Position logo at top right with professional dimensions
      doc.addImage(logoDataUrl, "PNG", CARD_WIDTH - 45, 5, 40, 12);
    } catch (error) {
      console.error("Error loading logo:", error);
    }

    // Add name with professional styling
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.orange[0], COLORS.orange[1], COLORS.orange[2]);
    doc.setFontSize(TEXT_SIZES.name);
    doc.text(businessCard.fullName, SPACING.margin, 18);

    // Add position with professional spacing and styling
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.black[0], COLORS.black[1], COLORS.black[2]);
    doc.setFontSize(TEXT_SIZES.position);
    const position = doc.splitTextToSize(businessCard.position, 60);
    doc.text(position, SPACING.margin, 25);

    // Add address with professional spacing and styling
    doc.setFontSize(TEXT_SIZES.address);
    doc.setFont("helvetica", "normal");
    const address =
      "Head Office: 14/15 Prince Alana Abiodun, Oniru Street, Oniru Estate, Victoria Island. Lagos, Nigeria";
    const addressLines = doc.splitTextToSize(address, 75);
    doc.text(addressLines, SPACING.margin, 36);

    // Contact information with professional alignment and increased spacing after address
    const contactY = 50 + SPACING.addressSpacing;
    const contactSpacing = SPACING.contactSpacing;

    // Add mobile with 'M' in orange
    doc.setTextColor(COLORS.orange[0], COLORS.orange[1], COLORS.orange[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TEXT_SIZES.contact);
    doc.text("M", SPACING.margin, contactY);

    // Add phone number in black
    doc.setTextColor(COLORS.black[0], COLORS.black[1], COLORS.black[2]);
    doc.setFont("helvetica", "normal");
    doc.text(businessCard.phone, SPACING.margin + 7, contactY);

    // Add email with 'E' in orange
    doc.setTextColor(COLORS.orange[0], COLORS.orange[1], COLORS.orange[2]);
    doc.setFont("helvetica", "bold");
    doc.text("E", SPACING.margin, contactY + contactSpacing);

    // Add email address in black
    doc.setTextColor(COLORS.black[0], COLORS.black[1], COLORS.black[2]);
    doc.setFont("helvetica", "normal");
    doc.text(businessCard.email, SPACING.margin + 7, contactY + contactSpacing);

    // Add website in orange at bottom right with professional positioning
    doc.setTextColor(COLORS.orange[0], COLORS.orange[1], COLORS.orange[2]);
    doc.setFontSize(TEXT_SIZES.website);
    doc.text(
      "www.accessbankplc.com",
      CARD_WIDTH - SPACING.margin,
      CARD_HEIGHT - 4,
      {
        align: "right",
      }
    );

    // Add QR Code with professional sizing and positioning
    try {
      // Generate QR code URL with consistent format
      const qrData = `http://localhost:3000/${businessCard.username}`;

      // Configure QR code with Access Bank branding
      const config = {
        body: "pointed",
        eye: "frame14",
        eyeBall: "ball14",
        erf1: [],
        erf2: ["fh"],
        erf3: ["fv"],
        brf1: [],
        brf2: ["fh"],
        brf3: ["fv"],
        bodyColor: "#000000",
        bgColor: "#FFFFFF",
        eye1Color: "#000000",
        eye2Color: "#000000",
        eye3Color: "#000000",
        eyeBall1Color: "#000000",
        eyeBall2Color: "#000000",
        eyeBall3Color: "#000000",
        gradientOnEyes: false,
        logoMode: "clean",
        logo: "https://asset.brandfetch.io/idPXJmyni4/idSLulezX4.png",
      };

      // Create high-resolution QR code request
      const params = new URLSearchParams({
        data: qrData,
        size: "800",
        config: JSON.stringify(config),
        file: "png",
      });

      const qrCodeApiUrl = `/api/qr-code?${params.toString()}`;

      // Fetch the QR code with proper error handling
      const qrResponse = await fetch(qrCodeApiUrl);
      if (!qrResponse.ok) {
        throw new Error(`Failed to fetch QR code: ${qrResponse.statusText}`);
      }

      const qrBlob = await qrResponse.blob();
      const qrDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(qrBlob);
      });

      // Add QR code with professional dimensions and positioning
      doc.addImage(qrDataUrl, "PNG", CARD_WIDTH - 30, CARD_HEIGHT - 42, 25, 25);
    } catch (error) {
      console.error("Error adding QR code:", error);
    }
  };

  // Function to create back of card with professional design
  const createBackPage = () => {
    doc.addPage([CARD_WIDTH, CARD_HEIGHT]);

    // Set white background
    doc.setFillColor(COLORS.white[0], COLORS.white[1], COLORS.white[2]);
    doc.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, "F");

    // Add blue diagonal section with professional proportions
    doc.setFillColor(COLORS.blue[0], COLORS.blue[1], COLORS.blue[2]);
    doc.triangle(0, 0, CARD_WIDTH * 0.5, 0, 0, CARD_HEIGHT, "F");

    // Add orange stripe with professional dimensions
    doc.setFillColor(COLORS.orange[0], COLORS.orange[1], COLORS.orange[2]);

    // First triangle to maintain consistent width
    doc.triangle(
      CARD_WIDTH * 0.5,
      0,
      CARD_WIDTH * 0.6,
      0,
      CARD_WIDTH * 0.1,
      CARD_HEIGHT,
      "F"
    );

    // Second triangle to complete the orange section
    doc.triangle(
      CARD_WIDTH * 0.1,
      CARD_HEIGHT,
      0,
      CARD_HEIGHT,
      CARD_WIDTH * 0.5,
      0,
      "F"
    );

    // Add "more than banking" slogan with professional styling
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.orange[0], COLORS.orange[1], COLORS.orange[2]);
    doc.setFontSize(TEXT_SIZES.slogan);
    doc.text("more than banking", CARD_WIDTH - 5, CARD_HEIGHT - 5, {
      align: "right",
    });
  };

  await createFrontPage();
  createBackPage();

  // Output the PDF with professional settings
  const pdfBlob = new Blob([doc.output("arraybuffer")], {
    type: "application/pdf",
  });

  return pdfBlob;
}

// Professional high-resolution QR code URL generator
export function generateHighResQRCodeUrl(businessCard: BusinessCard) {
  const qrData = `http://localhost:3000/${businessCard.username}`;

  const config = {
    body: "pointed",
    eye: "frame14",
    eyeBall: "ball14",
    erf1: [],
    erf2: ["fh"],
    erf3: ["fv"],
    brf1: [],
    brf2: ["fh"],
    brf3: ["fv"],
    bodyColor: "#000000",
    bgColor: "#FFFFFF",
    eye1Color: "#000000",
    eye2Color: "#000000",
    eye3Color: "#000000",
    eyeBall1Color: "#000000",
    eyeBall2Color: "#000000",
    eyeBall3Color: "#000000",
    gradientOnEyes: false,
    logoMode: "clean",
    logo: "https://asset.brandfetch.io/idPXJmyni4/idSLulezX4.png",
  };

  const params = new URLSearchParams({
    data: qrData,
    size: "800",
    config: JSON.stringify(config),
    file: "png",
  });

  return `/api/qr-code?${params.toString()}`;
}
