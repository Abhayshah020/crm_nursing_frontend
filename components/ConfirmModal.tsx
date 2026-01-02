"use client";

export default function ConfirmModal({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    danger = false,
}: any) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 cursor-pointer rounded-lg border hover:bg-gray-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 cursor-pointer rounded-lg text-white transition ${danger
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
