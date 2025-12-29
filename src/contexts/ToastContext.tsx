import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType) => void;
    hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
            {children}
            <ToastContainer toasts={toasts} onClose={hideToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
    if (toasts.length === 0) return null;

    const icons = {
        success: <CheckCircle size={18} />,
        error: <XCircle size={18} />,
        warning: <AlertCircle size={18} />,
        info: <AlertCircle size={18} />
    };

    const styles = {
        success: "bg-green-500/10 border-green-500/20 text-green-400",
        error: "bg-red-500/10 border-red-500/20 text-red-400",
        warning: "bg-amber-500/10 border-amber-500/20 text-amber-400",
        info: "bg-blue-500/10 border-blue-500/20 text-blue-400"
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg animate-in slide-in-from-right-5 fade-in duration-300 ${styles[toast.type]}`}
                >
                    {icons[toast.type]}
                    <span className="text-sm font-medium text-white">{toast.message}</span>
                    <button
                        onClick={() => onClose(toast.id)}
                        className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
