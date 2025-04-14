import { PrismaClient } from "../lib/generated/prisma/index.js";
import bcryptjs from "bcryptjs";
const { genSalt, hash } = bcryptjs;

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  try {
    // Check if admin user exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail.toLowerCase() },
    });

    if (!existingAdmin) {
      // Create admin user with properly hashed password
      const salt = await genSalt(10);
      const hashedPassword = await hash(adminPassword, salt);

      const user = await prisma.user.create({
        data: {
          email: adminEmail.toLowerCase(),
          password: hashedPassword,
          name: "Administrator",
          isAdmin: true,
        },
      });
      console.log("✅ Admin user created successfully:", user.email);
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error in seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
