
"use client"

import type React from "react"

import type { Metadata } from "next"
import { useRouter } from "next/router"
import "./globals.css"
import Cookies from "js-cookie";

// export const metadata: Metadata = {
//   title: "SMS IT Solutions - Nursing Care CRM Platform",
//   description:
//     "Transform your nursing care management with comprehensive CRM tools for care plans, daily notes, and client management. Improve efficiency and care quality.",
//   generator: "v0.app",
//   icons: {
//     icon: [
//       {
//         url: "/icon-light-32x32.png",
//         media: "(prefers-color-scheme: light)",
//       },
//       {
//         url: "/icon-dark-32x32.png",
//         media: "(prefers-color-scheme: dark)",
//       },
//       {
//         url: "/icon.svg",
//         type: "image/svg+xml",
//       },
//     ],
//     apple: "/apple-icon.png",
//   },
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()

  if (router.pathname !== "/" && router.pathname !== "/login") {
    if (
      !router.pathname.match(/\.(css|js|mp4|webm|ogg|mp3|wav|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$/)
    ) {
      const token = Cookies.get("accessToken")?.value;
      if (!token) {
        router.replace("/login");
      }
    }
  }


  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
