import { Plus } from "lucide-react"
import Link from "next/link"
import type React from "react"
export default function PageContainer({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="flex justify-between text-3xl sm:text-4xl font-bold text-foreground mb-2 text-balance">{title}
          </h1>
          {subtitle && <p className="text-base sm:text-lg text-muted-foreground text-pretty">{subtitle}</p>}

        </div>

        {children}
      </div>
    </div>
  )
}
