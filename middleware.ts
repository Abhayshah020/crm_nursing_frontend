import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  // Allow static files
  if (
    pathname.match(
      /\.(mp4|webm|ogg|mp3|wav|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/
    )
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    // Use absolute URL for production
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}
