"use client";

import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // App Router
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Only run in the browser
    const path = window.location.pathname;
    if (path !== "/" && path !== "/login") {
      const token = Cookies.get("accessToken");
      if (!token) {
        router.replace("/login");
      }
    }
  }, [router]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
