// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public routes – allow access
    if (pathname === "/" || pathname === "/login") {
        return NextResponse.next();
    }

    // Allow static files (CSS, JS, images, fonts)
    if (
        pathname.match(/\.(css|js|mp4|webm|ogg|mp3|wav|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/)
    ) {
        return NextResponse.next();
    }

    // Check JWT in cookies
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
        // Redirect to login page if no token
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Token exists – allow access
    return NextResponse.next();
}

// Apply middleware to all pages except api and static files
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
