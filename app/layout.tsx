"use client";

import { useRouter } from "next/navigation"; // App Router
import React, { useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const path = window.location.pathname;

    if (path !== "/" && path !== "/login") {
      const user = sessionStorage.getItem("user"); // ✅ Correct
      if (!user) {
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
