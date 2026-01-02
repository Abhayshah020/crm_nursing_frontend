"use client";

import { useEffect } from "react";
import {
    CheckCircle,
    Info,
    AlertTriangle,
    XCircle,
    X,
} from "lucide-react";

const toastConfig = {
    info: {
        icon: Info,
        bg: "bg-blue-50/90 text-blue-800",
        border: "border-blue-400",
        accent: "bg-blue-500",
    },
    success: {
        icon: CheckCircle,
        bg: "bg-green-50/90 text-green-800",
        border: "border-green-400",
        accent: "bg-green-500",
    },
    warning: {
        icon: AlertTriangle,
        bg: "bg-yellow-50/90 text-yellow-800",
        border: "border-yellow-400",
        accent: "bg-yellow-500",
    },
    error: {
        icon: XCircle,
        bg: "bg-red-50/90 text-red-800",
        border: "border-red-400",
        accent: "bg-red-500",
    },
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

    const config = toastConfig[type] || toastConfig.info;
    const Icon = config.icon;

    return (
        <div
            className={`
        relative flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md
        shadow-lg min-w-[320px] max-w-sm overflow-hidden
        animate-toast-in
        ${config.bg} ${config.border}
      `}
        >
            {/* Accent bar */}
            <div className={`absolute left-0 top-0 h-full w-1 ${config.accent}`} />

            {/* Icon */}
            <Icon className="w-5 h-5 mt-0.5 shrink-0" />

            {/* Message */}
            <p className="flex-1 text-sm leading-relaxed">
                {message}
            </p>

            {/* Close */}
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition"
            >
                <X size={16} />
            </button>
        </div>
    );
}
