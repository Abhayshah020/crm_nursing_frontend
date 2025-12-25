"use client";

import Link from "next/link";
import {
    Users,
    ClipboardList,
    FileText,
    Activity,
    HeartPulse,
    Brain,
    Droplet,
    Utensils,
    Bath,
    Toilet,
} from "lucide-react";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
                <div className="p-6 text-xl font-bold text-indigo-600">
                    HDCS CRM
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <SidebarLink href="/dashboard" icon={<Activity />} label="Dashboard" />
                    <SidebarLink href="/patients" icon={<Users />} label="Patients" />
                    <SidebarLink href="/care-plans" icon={<ClipboardList />} label="Care Plans" />
                    <SidebarLink href="/daily-notes" icon={<FileText />} label="Daily Notes" />

                    <div className="mt-6 text-xs text-gray-400 uppercase px-2">
                        Clinical Records
                    </div>

                    <SidebarLink label="Core Vital Signs" icon={<HeartPulse />} />
                    <SidebarLink label="Pain & Comfort" icon={<Activity />} />
                    <SidebarLink label="Neurological Observations" icon={<Brain />} />
                    <SidebarLink label="Skin & Circulation" icon={<Droplet />} />
                    <SidebarLink label="Food & Fluid Intake" icon={<Utensils />} />
                    <SidebarLink label="General Hygiene Care" icon={<Bath />} />
                    <SidebarLink label="Bowel Chart" icon={<Toilet />} />
                    <SidebarLink label="Urine Monitoring" icon={<Droplet />} />
                </nav>

                <div className="p-4 border-t text-sm text-gray-500">
                    Secure • Role Based Access
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex flex-col w-full">
                <main className="flex-1">

                    {/* HEADER */}
                    <header className="flex items-center justify-between mb-6 px-6 py-4">
                        <Link
                            href="https://hdcs.com.au/"
                            className="flex items-center gap-2 font-bold text-l sm:text-2xl bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent"
                        >
                            <Image
                                src="/logo.jpeg"
                                alt="SMS IT Solutions Logo"
                                width={100}
                                height={20}
                            />
                            HDCS
                        </Link>


                        {/* <div className="flex gap-3">
                            <Link
                                href="/patients/create"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                            >
                                + Add Patient
                            </Link>
                        </div> */}
                    </header>

                    {/* STATS */}
                    {/* <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 mb-8">
                        <StatCard title="Patients" value="124" />
                        <StatCard title="Care Plans" value="58" />
                        <StatCard title="Daily Notes Today" value="36" />
                        <StatCard title="Staff Active" value="12" />
                    </section> */}

                    {/* MODULE GRID */}
                    <section className="p-6 flex-1 space-y-1">
                        <h2 className="text-lg font-semibold mb-4">
                            Care & Clinical Modules
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            <ModuleCard
                                title="Patients"
                                desc="Create and manage patient profiles"
                                href="/patients"
                            />

                            <ModuleCard
                                title="Care Plans"
                                desc="Structured care planning and reviews"
                                href="/care-plans"
                                primary
                            />

                            <ModuleCard
                                title="Daily Notes"
                                desc="Daily care observations & notes"
                                href="/daily-notes"
                                primary
                            />

                            <PlaceholderCard title="Core Vital Signs" />
                            <PlaceholderCard title="Pain & Comfort Assessment" />
                            <PlaceholderCard title="Neurological Observations" />
                            <PlaceholderCard title="Skin & Circulation" />
                            <PlaceholderCard title="Food & Fluid Intake" />
                            <PlaceholderCard title="General Hygiene Care" />
                            <PlaceholderCard title="Bowel Chart" />
                            <PlaceholderCard title="Urine Monitoring" />

                        </div>
                    </section>

                </main>
                <Footer />
            </div>
        </div>
    );
}

/* ---------------- Components ---------------- */

function SidebarLink({ href = "#", icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
    );
}

function ModuleCard({ title, desc, href, primary = false }) {
    return (
        <Link
            href={href}
            className={`rounded-xl p-5 shadow-sm transition hover:shadow-md ${primary
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800"
                }`}
        >
            <h3 className="font-semibold">{title}</h3>
            <p className={`text-sm mt-2 ${primary ? "text-white/80" : "text-gray-500"}`}>
                {desc}
            </p>
        </Link>
    );
}

function PlaceholderCard({ title }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-dashed text-gray-400">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm mt-2">
                Module coming soon
            </p>
        </div>
    );
}
