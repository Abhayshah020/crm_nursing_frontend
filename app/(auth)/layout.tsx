"use client";

import Footer from "@/components/Footer";
import ProtectedPage from "@/components/ProtectedPage";
import { ToastProvider, useToast } from "@/components/toast/ToastContext";
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
  Settings,
  Toilet,
  Users,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosClient.post("/authentication/logout");
      Cookies.remove("accessToken");
      localStorage.removeItem("user");

      if (typeof window !== "undefined") {
        router.push("/login")
      }
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <ToastProvider>
      <ProtectedPage>
        <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">

          {/* MOBILE HEADER */}
          <div className="lg:hidden p-4 border-b bg-white flex items-center">
            <button onClick={() => setMobileOpen(true)}>
              <Menu />
            </button>
            <span className="ml-4 font-semibold text-indigo-600">HDCS CRM</span>
          </div>


          {/* DESKTOP SIDEBAR */}
          <aside className="w-64 bg-white border-r hidden lg:flex flex-col shadow-lg">
            <SidebarContent onLogout={handleLogout} />
          </aside>

          {/* MOBILE SIDEBAR */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setMobileOpen(false)}
              />

              {/* Drawer */}
              <aside className="absolute left-0 top-0 h-full max-w-[50%] min-w-64 bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="text-lg font-bold text-indigo-600">HDCS CRM</span>
                  <button onClick={() => setMobileOpen(false)}>
                    <X />
                  </button>
                </div>

                <SidebarContent onLogout={handleLogout} />
              </aside>
            </div>
          )}


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


function SidebarContent({ onLogout }) {
  const [userExist, setUserExist] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const user = sessionStorage.getItem("user");
    if (user) {
      try {
        setUserExist(JSON.parse(user));
      } catch {
        setUserExist(null);
      }
    }
  }, []);

  return (
    <>
      <div className="p-6 text-2xl hidden lg:flex font-bold text-indigo-600 tracking-wide">
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

        <SidebarLink href="/core-vital-signs" icon={<HeartPulse />} label="Core Vital Signs" />
        <SidebarLink href="/pain-comfort-assessments" icon={<Activity />} label="Pain & Comfort" />
        <SidebarLink href="/neuro-general-observations" icon={<Brain />} label="Neurological Observations" />
        <SidebarLink href="/skin-circulations" icon={<Droplet />} label="Skin & Circulation" />
        <SidebarLink href="/food-fluid-intakes" icon={<Utensils />} label="Food & Fluid Intake" />
        <SidebarLink href="/general-hygiene-care" icon={<Bath />} label="General Hygiene Care" />
        <SidebarLink href="/bowel-charts" icon={<Toilet />} label="Bowel Chart" />
        <SidebarLink href="/urine-monitoring" icon={<Droplet />} label="Urine Monitoring" />

        <div className="mt-6 text-xs text-gray-400 uppercase px-2 font-semibold">
          Other
        </div>

        {userExist && userExist?.role === 'admin' && (
          <SidebarLink href="/settings/users" icon={<Settings />} label="Settings" />
        )}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition cursor-pointer"
          onClick={onLogout}
        >
          <LogOut />
          <span>Log out</span>
        </div>
      </nav>
    </>
  );
}
