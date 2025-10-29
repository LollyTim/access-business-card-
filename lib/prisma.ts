import { PrismaClient } from "./generated/prisma";

const validateDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl) {
    console.error("DATABASE_URL environment variable not found");
    throw new Error("DATABASE_URL environment variable not found");
  }
  try {
    new URL(envUrl);
  } catch (error) {
    console.error(
      "Invalid DATABASE_URL format:",
      error instanceof Error ? error.message : String(error)
    );
    throw new Error("Invalid DATABASE_URL format");
  }
};

const prismaClientSingleton = () => {
  validateDatabaseUrl();

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export type PrismaType = ReturnType<typeof prismaClientSingleton>;
