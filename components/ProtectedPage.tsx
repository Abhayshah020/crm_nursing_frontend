"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function ProtectedPage({ children }: Props) {
    const router = useRouter();

    useEffect(() => {
        const token = sessionStorage.getItem("user"); // or Cookies.get("accessToken")
        if (!token) {
            router.replace("/login");
        }
    }, [router]);

    return <>{children}</>; // render children if token exists
}
