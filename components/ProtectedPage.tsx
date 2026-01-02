"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function ProtectedPage({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Allow public pages
        if (pathname === "/login" || pathname === "/") {
            return;
        }

        const userRaw = sessionStorage.getItem("user");

        // Not logged in
        if (!userRaw) {
            router.replace("/login");
            return;
        }

        const user = JSON.parse(userRaw);

        // Protect all /settings routes (admin only)
        if (pathname.startsWith("/settings")) {
            if (user.role !== "admin") {
                router.replace("/unauthorized-page"); // or "/dashboard"
                return;
            }
        }
    }, [pathname, router]);

    return <>{children}</>;
}
