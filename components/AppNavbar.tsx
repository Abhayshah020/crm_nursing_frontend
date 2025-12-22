"use client"

import Link from "next/link"
import { ClipboardList, FileText, Plus } from "lucide-react"

export default function AppNavbar() {
    return (
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link
                    href="/"
                    className="font-bold text-l sm:text-2xl bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent"
                >
                    SMS IT Solutions CRM
                </Link>

                <div className="flex items-center gap-3 sm:gap-6">
                    <Link
                        href="/care-plans"
                        className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                    >
                        <ClipboardList size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Care Plans</span>
                    </Link>

                    <Link
                        href="/daily-notes"
                        className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors group"
                    >
                        <FileText size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline">Daily Notes</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
