import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  // Allow Next.js internal files
  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    // Absolute URL in production
    return NextResponse.redirect("https://crmnursing.smsitsolutions.com.au/login");
  }

  return NextResponse.next();
}

// No matcher in next.config.js. The middleware file itself is automatically applied.
