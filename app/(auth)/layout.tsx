"use client";

import Footer from "@/components/Footer";
import ProtectedPage from "@/components/ProtectedPage";
import { ToastProvider } from "@/components/toast/ToastContext";
import axiosClient from "@/lib/axiosClient";
import Cookies from "js-cookie";
import {
  Activity,
  Bath,
  Brain,
  ClipboardList,
  Droplet,
  FileText,
  HeartPulse,
  LogOut,
  Toilet,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const handleLogout = async () => {
    try {
      await axiosClient.post("/authentication/logout");
      Cookies.remove("accessToken");
      localStorage.removeItem("user");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <ToastProvider>
      <ProtectedPage>
        <div className="flex min-h-screen bg-gray-50">

          {/* SIDEBAR */}
          <aside className="w-64 bg-white border-r hidden lg:flex flex-col shadow-lg">
            <div className="p-6 text-2xl font-bold text-indigo-600 tracking-wide">
              HDCS CRM
            </div>

            <nav className="flex-1 px-4 mt-4 space-y-2">
              <div className="text-xs text-gray-400 uppercase px-2 font-semibold">
                Basics
              </div>

              <SidebarLink href="/dashboard" icon={<Activity />} label="Dashboard" />
              <SidebarLink href="/patients" icon={<Users />} label="Patients" />
              <SidebarLink href="/care-plans" icon={<ClipboardList />} label="Care Plans" />
              <SidebarLink href="/daily-notes" icon={<FileText />} label="Daily Notes" />

              <div className="mt-6 text-xs text-gray-400 uppercase px-2 font-semibold">
                Clinical Records
              </div>

              <SidebarLink href="/core-vital-signs" label="Core Vital Signs" icon={<HeartPulse />} />
              <SidebarLink href="/pain-comfort-assessments" label="Pain & Comfort" icon={<Activity />} />
              <SidebarLink href="/neuro-general-observations" label="Neurological Observations" icon={<Brain />} />
              <SidebarLink href="/skin-circulations" label="Skin & Circulation" icon={<Droplet />} />
              <SidebarLink href="/food-fluid-intakes" label="Food & Fluid Intake" icon={<Utensils />} />
              <SidebarLink href="/general-hygiene-care" label="General Hygiene Care" icon={<Bath />} />
              <SidebarLink href="/bowel-charts" label="Bowel Chart" icon={<Toilet />} />
              <SidebarLink href="/urine-monitoring" label="Urine Monitoring" icon={<Droplet />} />

              <div className="mt-6 text-xs text-gray-400 uppercase px-2 font-semibold">
                Other
              </div>

              <div
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut />
                <span>Log out</span>
              </div>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col">
            {children}
            <Footer />
          </div>
        </div>
      </ProtectedPage>
    </ToastProvider>
  );
}

function SidebarLink({ href = "#", icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
