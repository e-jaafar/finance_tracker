import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-white/5 bg-surface/50 border-dashed animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white/5 p-4 rounded-full mb-4 ring-1 ring-white/10 shadow-lg shadow-black/20">
                <Icon className="text-slate-400" size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">{description}</p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-lg bg-indigo-600 px-6 font-medium text-white transition-all hover:bg-indigo-500 active:scale-95"
                >
                    <span className="mr-2">{actionLabel}</span>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-50" />
                </button>
            )}
        </div>
    );
}
