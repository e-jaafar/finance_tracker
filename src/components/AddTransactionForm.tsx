import React, { useRef, useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { PlusCircle } from "lucide-react";

export default function AddTransactionForm() {
    const [type, setType] = useState<"income" | "expense">("expense");
    const amountRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);
    const { addTransaction } = useTransactions();
    const [isOpen, setIsOpen] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (
            !amountRef.current ||
            !descRef.current ||
            !categoryRef.current ||
            !dateRef.current
        )
            return;

        await addTransaction(
            type,
            parseFloat(amountRef.current.value),
            descRef.current.value,
            categoryRef.current.value,
            dateRef.current.value
        );

        // Reset form
        amountRef.current.value = "";
        descRef.current.value = "";
        categoryRef.current.value = "";
        // Keep date or reset to today? Let's reset to today
        dateRef.current.value = new Date().toISOString().split("T")[0];
        setIsOpen(false);
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl fixed bottom-8 right-8 md:static md:w-auto"
            >
                <PlusCircle size={20} /> Add Transaction
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <h2 className="mb-4 text-xl font-bold text-gray-800">New Transaction</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex gap-2 rounded-lg bg-gray-100 p-1">
                        <button
                            type="button"
                            onClick={() => setType("expense")}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${type === "expense"
                                ? "bg-white text-red-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("income")}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${type === "income"
                                ? "bg-white text-green-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Income
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            ref={amountRef}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            ref={dateRef}
                            defaultValue={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Category
                        </label>
                        <input
                            type="text"
                            required
                            ref={categoryRef}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="e.g. Food, Salary, Rent"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Description
                        </label>
                        <input
                            type="text"
                            required
                            ref={descRef}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="What is this for?"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 rounded border border-gray-300 bg-white py-2 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 rounded py-2 font-bold text-white transition ${type === "expense"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
