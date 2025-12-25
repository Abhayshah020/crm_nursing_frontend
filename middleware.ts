import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public routes
    if (pathname === "/" || pathname === "/login") {
        return NextResponse.next();
    }

    // Read JWT from cookie
    const token = req.cookies.get("accessToken")?.value;

    // If no token, redirect
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
