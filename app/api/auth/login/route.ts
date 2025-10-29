import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma";
// import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Input validation
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          isAdmin: true,
        },
      });
    } catch (dbError) {
      console.error("Database error:", dbError);

      // Handle Prisma initialization errors (connection issues)
      if (
        dbError instanceof Prisma.PrismaClientInitializationError ||
        (dbError as any)?.code === "P1001"
      ) {
        console.error(
          "Database connection error - Server may have closed connection"
        );
        return NextResponse.json(
          { message: "Database connection error. Please try again." },
          { status: 503 }
        );
      }

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        return NextResponse.json(
          { message: "Database error occurred" },
          { status: 500 }
        );
      }
      throw dbError;
    }

    if (!user?.password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Password comparison with timing attack protection
    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create JWT token with jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      token,
    });

    // Set secure cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
