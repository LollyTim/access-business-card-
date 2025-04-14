import { PrismaClient } from "./generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// Parse DATABASE_URL from environment and handle potential issues
const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) {
    console.error("DATABASE_URL environment variable not found");
    throw new Error("DATABASE_URL environment variable not found");
  }
  try {
    // Validate URL format
    new URL(envUrl);
    return envUrl;
  } catch (error) {
    console.error(
      "Invalid DATABASE_URL format:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("Invalid DATABASE_URL format");
  }
};

const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: ["query", "error", "warn"],
      datasources: {
        db: {
          url: getDatabaseUrl(),
        },
      },
    }).$extends(withAccelerate());
  } catch (error) {
    console.error(
      "Failed to initialize Prisma client:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export type PrismaType = ReturnType<typeof prismaClientSingleton>;
