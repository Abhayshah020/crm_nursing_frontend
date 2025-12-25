import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public pages
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  // Allow Next.js internals (CSS, JS, images, static files)
  if (pathname.startsWith("/_next/") || pathname.startsWith("/api/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    // Redirect to login
    return NextResponse.redirect("https://crmnursing.smsitsolutions.com.au/login");
  }

  return NextResponse.next();
}
