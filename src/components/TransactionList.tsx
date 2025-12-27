import type { Transaction } from "../hooks/useTransactions";
import { Trash2, TrendingUp, TrendingDown, Edit2, Calendar } from "lucide-react";

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => Promise<void>;
    onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-white/5 bg-surface border-dashed">
                <div className="bg-white/5 p-4 rounded-full mb-4">
                    <Calendar className="text-text-muted" size={32} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No transactions yet</h3>
                <p className="text-sm text-text-muted">Start by adding your first income or expense.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((t) => (
                <div
                    key={t.id}
                    className="group flex items-center justify-between rounded-xl border border-white/5 bg-surface p-4 shadow-sm transition-all hover:border-white/10 hover:shadow-md hover:translate-x-1"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${t.type === "income"
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}
                        >
                            {t.type === "income" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{t.description}</p>
                            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">{t.category}</span>
                                <span>•</span>
                                <span>{new Date(t.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span
                            className={`font-bold text-lg ${t.type === "income" ? "text-green-400" : "text-red-400"
                                }`}
                        >
                            {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                        </span>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(t)}
                                className="p-2 rounded-lg text-text-muted hover:text-indigo-400 hover:bg-white/5 transition-colors"
                                title="Edit"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => onDelete(t.id)}
                                className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-white/5 transition-colors"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
