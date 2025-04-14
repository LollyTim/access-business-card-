import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  // Check if the request is for a protected route
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirect to login page with return URL
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Get JWT secret
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      // Create secret key for JWT verification
      const secretKey = new TextEncoder().encode(secret);

      // Verify JWT token
      await jose.jwtVerify(token, secretKey, {
        algorithms: ["HS256"],
      });

      return NextResponse.next();
    } catch (error) {
      // Token is invalid or expired
      console.error("JWT verification failed:", error);
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Add other protected routes here
  ],
};
