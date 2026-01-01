"use client";

import { useEffect } from "react";

const styles = {
    info: "bg-blue-50 text-blue-700 border-blue-300",
    success: "bg-green-50 text-green-700 border-green-300",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-300",
    error: "bg-red-50 text-red-700 border-red-300",
};

export default function Toast({
    message,
    type = "info",
    duration = 3000,
    onClose,
}) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md min-w-[280px]
      ${styles[type] || styles.info}`}
        >
            <span className="flex-1 text-sm">{message}</span>

            <button
                onClick={onClose}
                className="text-sm font-bold opacity-60 hover:opacity-100"
            >
                ✕
            </button>
        </div>
    );
}
