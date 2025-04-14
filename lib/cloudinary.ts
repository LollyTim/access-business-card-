import { v2 as cloudinary } from "cloudinary";
import type { UploadApiOptions, UploadApiResponse } from "cloudinary";

// Ensure environment variables are properly typed and available
const CLOUDINARY_CONFIG = {
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
} as const;

// Validate configuration
if (
  !CLOUDINARY_CONFIG.cloud_name ||
  !CLOUDINARY_CONFIG.api_key ||
  !CLOUDINARY_CONFIG.api_secret
) {
  throw new Error(
    "Missing required Cloudinary configuration. Please check your environment variables."
  );
}

// Configure Cloudinary with validated config
cloudinary.config(CLOUDINARY_CONFIG);

export async function uploadImage(file: string): Promise<string> {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  try {
    // Remove potential file prefix for proper upload
    const base64Data = file.includes("base64,")
      ? file.split("base64,")[1]
      : file;

    const uploadOptions: UploadApiOptions = {
      folder: "access-business-cards",
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto:best", fetch_format: "auto" },
      ],
      unique_filename: true,
      overwrite: false,
      format: "webp",
    };

    console.log("Starting Cloudinary upload with options:", {
      ...uploadOptions,
      // Exclude sensitive data from logs
      resource_type: uploadOptions.resource_type,
      folder: uploadOptions.folder,
    });

    const result = (await cloudinary.uploader.upload(
      `data:image/webp;base64,${base64Data}`,
      uploadOptions
    )) as UploadApiResponse;

    if (!result?.secure_url) {
      throw new Error("Upload successful but no secure URL returned");
    }

    console.log("Cloudinary upload successful:", {
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      url: result.secure_url,
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
    throw new Error(
      error instanceof Error
        ? `Failed to upload image: ${error.message}`
        : "Failed to upload image to Cloudinary"
    );
  }
}

export default cloudinary;
