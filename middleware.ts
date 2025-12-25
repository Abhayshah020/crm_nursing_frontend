import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  // Allow static media files (videos, images, fonts)
  if (
    pathname.match(
      /\.(mp4|webm|ogg|mp3|wav|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/
    )
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
