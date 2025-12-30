import React, { useState } from "react";
import { useBudgets } from "../hooks/useBudgets";
import type { Transaction } from "../hooks/useTransactions";
import { Check, Plus, Trash2, X, Target } from "lucide-react";
import EmptyState from "./EmptyState";
import { useCategories } from "../hooks/useCategories";
import { useCurrency } from "../contexts/CurrencyContext";

export default function BudgetGoals({ transactions }: { transactions: Transaction[] }) {
    const { budgets, setBudget, removeBudget } = useBudgets();
    const { categories } = useCategories();
    const { formatAmount, currencyInfo } = useCurrency();
    const [isAdding, setIsAdding] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [newLimit, setNewLimit] = useState("");

    // Get progress for a budget goal by category name
    // For expense categories: tracks spending against limit
    // For savings/income categories: tracks income as progress toward goal
    const getProgress = (category: string) => {
        const expenses = transactions
            .filter((t) => t.type === "expense" && t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
        
        const income = transactions
            .filter((t) => t.type === "income" && t.category === category)
            .reduce((sum, t) => sum + t.amount, 0);
        
        // If there's income for this category, treat it as a savings goal
        // Otherwise, treat it as an expense budget
        return { expenses, income, isSavingsGoal: income > 0 && expenses === 0 };
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

    return (
        <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 shrink-0">
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
                <form onSubmit={handleAddBudget} className="mb-6 rounded-xl bg-background p-4 border border-white/10 shadow-inner shrink-0">
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
                                {categories.map(cat => <option key={cat.id} value={cat.name} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-text-muted uppercase tracking-wide">Monthly Limit ({currencyInfo.symbol})</label>
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

            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-[200px]">
                {budgets.length === 0 ? (
                    <EmptyState
                        icon={Target}
                        title="No budgets set"
                        description="Set monthly limits to keep track of your spending per category."
                        actionLabel="Set Budget"
                        onAction={() => setIsAdding(true)}
                    />
                ) : (
                    budgets.map((b) => {
                        const { expenses, income, isSavingsGoal } = getProgress(b.category);
                        const currentAmount = isSavingsGoal ? income : expenses;
                        const progress = calculateProgress(currentAmount, b.limit);
                        const isOver = expenses > b.limit && !isSavingsGoal;
                        const isGoalReached = isSavingsGoal && income >= b.limit;

                        return (
                            <div key={b.category} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white text-sm">{b.category}</span>
                                        {isSavingsGoal && (
                                            <span className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-400 tracking-wide">
                                                Savings
                                            </span>
                                        )}
                                        {isOver && (
                                            <span className="rounded bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-400 tracking-wide">
                                                Exceeded
                                            </span>
                                        )}
                                        {isGoalReached && (
                                            <span className="rounded bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-green-400 tracking-wide">
                                                Reached
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-text-secondary">
                                            <span className={`font-bold ${isOver ? "text-red-400" : isGoalReached ? "text-green-400" : "text-white"}`}>
                                                {formatAmount(currentAmount)}
                                            </span>{" "}
                                            <span className="text-text-muted">/</span> {formatAmount(b.limit)}
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
                                        className={`h-full rounded-full transition-all duration-700 ease-out ${isSavingsGoal ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" : getProgressColor(progress)}`}
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
