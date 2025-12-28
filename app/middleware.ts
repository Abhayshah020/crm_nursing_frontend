import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public routes that don't need auth
const PUBLIC_PATHS = ["/login", "/"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // If route is public, allow
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Read token from cookie
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
