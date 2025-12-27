import React, { useState } from "react";
import { useBudgets } from "../hooks/useBudgets";
import type { Transaction } from "../hooks/useTransactions";
import { Check, Plus, Trash2, X, Target } from "lucide-react";

export default function BudgetGoals({ transactions }: { transactions: Transaction[] }) {
    const { budgets, setBudget, removeBudget } = useBudgets();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [newLimit, setNewLimit] = useState("");

    const getSpent = (category: string) => {
        return transactions
            .filter((t) => t.type === "expense" && t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const calculateProgress = (spent: number, limit: number) => {
        return Math.min((spent / limit) * 100, 100);
    };

    const getProgressColor = (percent: number) => {
        if (percent >= 100) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
        if (percent >= 80) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
        return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
    };

    async function handleAddBudget(e: React.FormEvent) {
        e.preventDefault();
        if (!newCategory || !newLimit) return;
        await setBudget(newCategory, parseFloat(newLimit));
        setIsAdding(false);
        setNewCategory("");
        setNewLimit("");
    }

    // Get used categories from transactions to suggest auto-completion
    const usedCategories = Array.from(new Set(transactions.map(t => t.category)));

    return (
        <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-xl h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="text-indigo-500" size={20} />
                    Budget Goals
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-1 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:bg-indigo-500/20 transition hover:text-indigo-300 border border-indigo-500/20"
                >
                    {isAdding ? <X size={14} /> : <Plus size={14} />}
                    {isAdding ? "Cancel" : "Add"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddBudget} className="mb-6 rounded-xl bg-background p-4 border border-white/10 shadow-inner">
                    <div className="grid gap-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-text-muted uppercase tracking-wide">Category</label>
                            <input
                                type="text"
                                list="categories"
                                placeholder="e.g. Food"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                                className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                            <datalist id="categories">
                                {usedCategories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-text-muted uppercase tracking-wide">Monthly Limit ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 500"
                                value={newLimit}
                                onChange={(e) => setNewLimit(e.target.value)}
                                required
                                className="w-full rounded-lg border border-white/10 bg-surface px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
                        >
                            <Check size={16} /> Save Budget
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {budgets.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="inline-block p-3 rounded-full bg-white/5 mb-3">
                            <Target size={24} className="text-text-muted opacity-50" />
                        </div>
                        <p className="text-sm text-text-muted">No budgets set yet.</p>
                        <p className="text-xs text-text-secondary mt-1">Set limits to track your spending.</p>
                    </div>
                ) : (
                    budgets.map((b) => {
                        const spent = getSpent(b.category);
                        const progress = calculateProgress(spent, b.limit);
                        const isOver = spent > b.limit;

                        return (
                            <div key={b.category} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white text-sm">{b.category}</span>
                                        {isOver && (
                                            <span className="rounded bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-400 tracking-wide">
                                                Exceeded
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-text-secondary">
                                            <span className={`font-bold ${isOver ? "text-red-400" : "text-white"}`}>
                                                ${spent.toFixed(0)}
                                            </span>{" "}
                                            <span className="text-text-muted">/</span> ${b.limit}
                                        </span>
                                        <button
                                            onClick={() => removeBudget(b.category)}
                                            className="text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Remove"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor(progress)}`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
