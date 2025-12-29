import { useState } from "react";
import { useRecurring } from "../hooks/useRecurring";
import { useCategories } from "../hooks/useCategories";
import { useCurrency } from "../contexts/CurrencyContext";
import {
    Plus,
    Trash2,
    Repeat,
    Calendar,
    Pause,
    Play,
    RefreshCw
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { Frequency } from "../types/recurring";

const FREQUENCY_LABELS: Record<Frequency, string> = {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly"
};

export default function RecurringManager() {
    const {
        recurringTransactions,
        loading,
        processing,
        forceProcessDueTransactions,
        addRecurring,
        toggleActive,
        deleteRecurring
    } = useRecurring();

    const { categories } = useCategories();
    const { formatAmount } = useCurrency();

    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        type: "expense" as "income" | "expense",
        category: "",
        frequency: "monthly" as Frequency,
        startDate: new Date().toISOString().split("T")[0]
    });

    const filteredCategories = categories.filter(c => c.type === formData.type);

    const renderIcon = (iconName: string, size = 16) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return <Icon size={size} />;
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.description || !formData.amount || !formData.category) return;

        setSubmitting(true);
        try {
            await addRecurring({
                description: formData.description,
                amount: parseFloat(formData.amount),
                type: formData.type,
                category: formData.category,
                frequency: formData.frequency,
                startDate: new Date(formData.startDate)
            });
            setIsAdding(false);
            setFormData({
                description: "",
                amount: "",
                type: "expense",
                category: "",
                frequency: "monthly",
                startDate: new Date().toISOString().split("T")[0]
            });
        } catch (error) {
            console.error("Failed to add recurring transaction", error);
        }
        setSubmitting(false);
    }

    function formatNextDue(timestamp: any) {
        if (!timestamp?.toDate) return "N/A";
        const date = timestamp.toDate();
        const now = new Date();
        const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Overdue";
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays < 7) return `In ${diffDays} days`;
        return date.toLocaleDateString();
    }

    function getCategoryInfo(categoryName: string) {
        const cat = categories.find(c => c.name === categoryName);
        return cat || { color: "#64748b", icon: "HelpCircle" };
    }

    if (loading) {
        return (
            <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-lg">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Repeat size={20} className="text-indigo-400" />
                    Recurring
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={forceProcessDueTransactions}
                        disabled={processing}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Process due transactions"
                    >
                        <RefreshCw size={16} className={processing ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <Plus size={16} />
                        {isAdding ? "Cancel" : "Add"}
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                    {/* Type Toggle */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.type === "expense"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-slate-900 text-slate-400 border border-white/5 hover:border-white/10"
                            }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                formData.type === "income"
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-slate-900 text-slate-400 border border-white/5 hover:border-white/10"
                            }`}
                        >
                            Income
                        </button>
                    </div>

                    {/* Description & Amount */}
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Description"
                            required
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="Amount"
                            min="0.01"
                            step="0.01"
                            required
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    {/* Category */}
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="">Select category</option>
                        {filteredCategories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Frequency & Start Date */}
                    <div className="grid grid-cols-2 gap-3">
                        <select
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Frequency })}
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                        {submitting ? "Adding..." : "Add Recurring"}
                    </button>
                </form>
            )}

            {/* List */}
            {recurringTransactions.length === 0 ? (
                <div className="text-center py-8">
                    <Repeat className="mx-auto mb-3 text-slate-600" size={32} />
                    <p className="text-slate-500 text-sm">No recurring transactions</p>
                    <p className="text-slate-600 text-xs mt-1">Add subscriptions, bills, or regular income</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {recurringTransactions.map((item) => {
                        const catInfo = getCategoryInfo(item.category);
                        const isOverdue = item.nextDueDate?.toDate() < new Date();

                        return (
                            <div
                                key={item.id}
                                className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                                    item.isActive
                                        ? "bg-slate-800/30 border-white/5 hover:border-white/10"
                                        : "bg-slate-900/50 border-white/5 opacity-50"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                                        style={{ backgroundColor: catInfo.color }}
                                    >
                                        {renderIcon(catInfo.icon)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white text-sm">{item.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{FREQUENCY_LABELS[item.frequency]}</span>
                                            <span>•</span>
                                            <span className={`flex items-center gap-1 ${isOverdue ? "text-amber-400" : ""}`}>
                                                <Calendar size={10} />
                                                {formatNextDue(item.nextDueDate)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`font-bold text-sm ${item.type === "income" ? "text-green-400" : "text-red-400"}`}>
                                        {item.type === "income" ? "+" : "-"}{formatAmount(item.amount)}
                                    </span>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => item.id && toggleActive(item.id, item.isActive)}
                                            className="p-1.5 text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                                            title={item.isActive ? "Pause" : "Resume"}
                                        >
                                            {item.isActive ? <Pause size={14} /> : <Play size={14} />}
                                        </button>
                                        <button
                                            onClick={() => item.id && deleteRecurring(item.id)}
                                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
