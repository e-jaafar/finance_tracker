interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "default";
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    onConfirm,
    onCancel
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: "bg-red-600 hover:bg-red-500",
        warning: "bg-amber-600 hover:bg-amber-500",
        default: "bg-indigo-600 hover:bg-indigo-500"
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-surface border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 mb-6">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors ${variantStyles[variant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
