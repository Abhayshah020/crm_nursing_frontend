"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function ProtectedPage({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname()

    useEffect(() => {
        if(pathname === "/login" || pathname === "/") {
            return; // allow access to login page
        }
        const token = sessionStorage.getItem("user"); // or Cookies.get("accessToken")
        if (!token) {
            router.replace("/login");
        }
    }, [router]);

    return <>{children}</>; // render children if token exists
}
