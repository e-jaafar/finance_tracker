
import type { Transaction } from "../hooks/useTransactions";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => Promise<void>;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {



    if (transactions.length === 0) {
        return <div className="text-center py-10 text-gray-500">No transactions yet. Add one to get started!</div>
    }

    return (
        <div className="space-y-4">
            {transactions.map((t) => (
                <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg bg-white p-4 shadow transition hover:shadow-md"
                >
                    <div className="flex items-center gap-4">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${t.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                }`}
                        >
                            {t.type === "income" ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{t.description}</p>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span>{t.category}</span>
                                <span>•</span>
                                <span>{new Date(t.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span
                            className={`font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                        </span>
                        <button
                            onClick={() => onDelete(t.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
