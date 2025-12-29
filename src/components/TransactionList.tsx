import type { Transaction } from "../hooks/useTransactions";
import { Trash2, Edit2, Calendar } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import * as LucideIcons from "lucide-react";
import EmptyState from "./EmptyState";

interface TransactionListProps {
    transactions: Transaction[];
    onDelete: (id: string) => Promise<void>;
    onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
    const { categories } = useCategories();

    // Helper to get category details
    const getCategoryDetails = (name: string) => {
        const cat = categories.find(c => c.name === name);
        return cat || { color: "#64748b", icon: "HelpCircle" }; // Default
    };

    const renderIcon = (iconName: string, size = 20) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return <Icon size={size} />;
    };

    if (transactions.length === 0) {
        return (
            <EmptyState
                icon={Calendar}
                title="No transactions found"
                description="Your transaction history will appear here once you start adding income or expenses."
            />
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((t) => {
                const categoryData = getCategoryDetails(t.category);

                return (
                    <div
                        key={t.id}
                        className="group flex items-center justify-between rounded-xl border border-white/5 bg-surface p-4 shadow-sm transition-all hover:border-white/10 hover:shadow-md hover:translate-x-1"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-sm"
                                style={{
                                    backgroundColor: categoryData.color,
                                    boxShadow: `0 0 10px ${categoryData.color}40` // Add glow
                                }}
                            >
                                {renderIcon(categoryData.icon || "Wallet")}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{t.description}</p>
                                <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                                    <span
                                        className="px-2 py-0.5 rounded-full border border-white/5 font-medium"
                                        style={{
                                            backgroundColor: `${categoryData.color}20`,
                                            color: categoryData.color,
                                            borderColor: `${categoryData.color}40`
                                        }}
                                    >
                                        {t.category}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(t.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <span
                                className={`font-bold text-lg ${t.type === "income" ? "text-green-400" : "text-white"
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
                )
            })}
        </div>
    );
}
