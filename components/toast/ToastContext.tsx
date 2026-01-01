"use client";

import { createContext, useContext, useState } from "react";
import Toast from "./Toast";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = ({
        message,
        type = "info",
        duration = 3000,
    }) => {
        const id = Date.now();

        setToasts((prev) => [
            ...prev,
            { id, message, type, duration },
        ]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast UI */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used inside ToastProvider");
    }
    return ctx;
};
