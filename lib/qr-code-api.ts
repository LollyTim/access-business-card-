/**
 * QR Code Monkey API Integration
 *
 * This file contains functions to interact with the QR Code Monkey API
 * for generating custom QR codes with logos and styling.
 *
 * API Documentation: https://www.qrcode-monkey.com/qr-code-api-with-logo/
 */

interface QRCodeConfig {
  body: string;
  eye: string;
  eyeBall: string;
  bodyColor: string;
  bgColor: string;
  eye1Color: string;
  eye2Color: string;
  eye3Color: string;
  eyeBall1Color: string;
  eyeBall2Color: string;
  eyeBall3Color: string;
  erf1?: string[];
  erf2?: string[];
  erf3?: string[];
  brf1?: string[];
  brf2?: string[];
  brf3?: string[];
  gradientOnEyes?: boolean;
  logo?: string;
  logoMode?: "default" | "clean";
}

interface QRCodeParams {
  data: string;
  size?: number;
  config?: Partial<QRCodeConfig>;
  file?: "png" | "svg" | "pdf" | "eps";
}

const DEFAULT_CONFIG: QRCodeConfig = {
  body: "circle",
  eye: "frame13",
  eyeBall: "ball14",
  bodyColor: "#0039CB",
  bgColor: "#FFFFFF",
  eye1Color: "#0039CB",
  eye2Color: "#0039CB",
  eye3Color: "#0039CB",
  eyeBall1Color: "#0039CB",
  eyeBall2Color: "#0039CB",
  eyeBall3Color: "#0039CB",
  erf1: [],
  erf2: [],
  erf3: [],
  brf1: [],
  brf2: [],
  brf3: [],
  gradientOnEyes: false,
  logo: "/access-logo.png",
  logoMode: "clean",
};

/**
 * Generates a URL for a QR code using the QR Code Monkey API
 *
 * @param options QR code generation options
 * @returns URL to the generated QR code
 */
export function generateQRCodeUrl({
  data,
  size = 340,
  config = {},
  file = "png",
}: QRCodeParams): string {
  const finalConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  // Use our internal API endpoint
  const params = new URLSearchParams({
    data: data,
    size: size.toString(),
    config: JSON.stringify(finalConfig),
    file: file,
  });

  return `/api/qr-code?${params.toString()}`;
}

/**
 * Extracts username from an email address
 *
 * @param email Email address
 * @returns Username portion of the email
 */
export function extractUsernameFromEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex > 0) {
    return email.substring(0, atIndex);
  }
  return email;
}

/**
 * In a real implementation, this function would make an actual API call to QR Code Monkey
 * For this demo, we're simulating the API call
 *
 * @param options QR code generation options
 * @returns Promise that resolves to the QR code image URL
 */
export async function generateQRCode(options: QRCodeParams): Promise<string> {
  // This would be an actual API call in a real implementation
  // For demo purposes, we're just returning the URL
  return generateQRCodeUrl(options);
}
