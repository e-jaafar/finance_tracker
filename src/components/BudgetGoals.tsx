import React, { useState } from "react";
import { useBudgets } from "../hooks/useBudgets";
import type { Transaction } from "../hooks/useTransactions";
import { Check, Plus, Trash2, X } from "lucide-react";

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
        if (percent >= 100) return "bg-red-500";
        if (percent >= 80) return "bg-yellow-500";
        return "bg-green-500";
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
        <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100 h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Budget Goals</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                >
                    {isAdding ? <X size={16} /> : <Plus size={16} />}
                    {isAdding ? "Cancel" : "Add"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAddBudget} className="mb-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-500">Category</label>
                            <input
                                type="text"
                                list="categories"
                                placeholder="e.g. Food"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                required
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                            <datalist id="categories">
                                {usedCategories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-500">Monthly Limit ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 500"
                                value={newLimit}
                                onChange={(e) => setNewLimit(e.target.value)}
                                required
                                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700"
                            >
                                <Check size={16} /> Save
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="space-y-6 overflow-y-auto max-h-[300px] pr-2">
                {budgets.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-4">No budgets set. Start by adding one!</p>
                ) : (
                    budgets.map((b) => {
                        const spent = getSpent(b.category);
                        const progress = calculateProgress(spent, b.limit);
                        const isOver = spent > b.limit;

                        return (
                            <div key={b.category}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-700">{b.category}</span>
                                        {isOver && (
                                            <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-600">
                                                Exceeded
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">
                                            <span className={`font-bold ${isOver ? "text-red-600" : "text-gray-800"}`}>
                                                ${spent.toFixed(0)}
                                            </span>{" "}
                                            / ${b.limit}
                                        </span>
                                        <button
                                            onClick={() => removeBudget(b.category)}
                                            className="text-gray-400 hover:text-red-500"
                                            title="Remove"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
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
