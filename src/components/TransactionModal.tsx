import React, { useState, useEffect } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { useAuth } from "../contexts/AuthContext";
import { useCategories } from "../hooks/useCategories";
import { X, Check, Repeat } from "lucide-react";
import type { Transaction } from "../hooks/useTransactions";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingTransaction?: Transaction | null;
}

export default function TransactionModal({ isOpen, onClose, existingTransaction }: TransactionModalProps) {
    const { addTransaction, updateTransaction } = useTransactions();
    const { categories } = useCategories();
    const { currentUser } = useAuth();

    // State
    const [type, setType] = useState<"income" | "expense">("expense");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<"weekly" | "monthly" | "yearly">("monthly");
    const [loading, setLoading] = useState(false);

    // Populate form if editing
    useEffect(() => {
        if (existingTransaction) {
            setType(existingTransaction.type);
            setAmount(existingTransaction.amount.toString());
            setDescription(existingTransaction.description);
            setCategory(existingTransaction.category);
            setDate(existingTransaction.date);
        } else {
            // Reset if adding new
            setType("expense");
            setAmount("");
            setDescription("");
            setCategory("");
            setDate(new Date().toISOString().split("T")[0]);
            setIsRecurring(false);
            setFrequency("monthly");
        }
    }, [existingTransaction, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const transactionData = {
            type,
            amount: parseFloat(amount),
            description,
            category,
            date,
        };

        try {
            if (existingTransaction) {
                await updateTransaction(existingTransaction.id, transactionData);
            } else {
                await addTransaction(transactionData);

                if (isRecurring && currentUser) {
                    const { addRecurringTransaction } = await import("../services/recurringService");
                    const { Timestamp } = await import("firebase/firestore");

                    await addRecurringTransaction(currentUser.uid, {
                        amount: parseFloat(amount),
                        category,
                        description,
                        type,
                        frequency,
                        startDate: Timestamp.fromDate(new Date(date))
                    });
                }
            }
        } catch (error) {
            console.warn("Transaction may be saved offline:", error);
        } finally {
            setLoading(false);
            onClose();
        }
    }

    const inputClassName = "w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-text-muted";
    const labelClassName = "mb-2 block text-xs font-bold text-text-secondary uppercase tracking-wide";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-6 py-4">
                    <h2 className="text-lg font-bold text-white">
                        {existingTransaction ? "Edit Transaction" : "New Transaction"}
                    </h2>
                    <button onClick={onClose} className="rounded-full p-1 text-text-muted hover:bg-white/10 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* Type Selector */}
                    <div className="flex gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setType("expense")}
                            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${type === "expense"
                                ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                : "bg-surfaceHighlight text-text-muted hover:bg-white/5 hover:text-white border border-transparent"
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("income")}
                            className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all ${type === "income"
                                ? "bg-green-500/20 text-green-400 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                                : "bg-surfaceHighlight text-text-muted hover:bg-white/5 hover:text-white border border-transparent"
                                }`}
                        >
                            Income
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="col-span-2 sm:col-span-1">
                            <label className={labelClassName}>Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className={inputClassName}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <label className={labelClassName}>Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="flex items-center h-full">
                            <input
                                id="recurring"
                                type="checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-[#16161d]"
                            />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="recurring" className="font-medium text-white text-sm flex items-center gap-2 cursor-pointer select-none">
                                <Repeat size={16} className="text-slate-400" />
                                Recurring Transaction?
                            </label>
                            {isRecurring && (
                                <p className="text-xs text-slate-400 mt-1">Will be automatically added every period.</p>
                            )}
                        </div>
                        {isRecurring && (
                            <div>
                                <select
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value as any)}
                                    className="bg-[#16161d] border border-white/10 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 outline-none"
                                >
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className={labelClassName}>Description</label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={inputClassName}
                            placeholder="e.g. Grocery Shopping"
                        />
                    </div>

                    <div>
                        <label className={labelClassName}>Category</label>
                        <select
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={inputClassName}
                        >
                            <option value="">Select a category</option>
                            {categories
                                .filter((cat) => cat.type === type || cat.type === "both")
                                .map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="animate-pulse">Saving...</span>
                            ) : (
                                <>
                                    <Check size={20} />
                                    {existingTransaction ? "Update Transaction" : "Save Transaction"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
