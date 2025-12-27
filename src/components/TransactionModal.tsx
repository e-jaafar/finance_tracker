import React, { useState, useEffect } from "react";
import { useTransactions } from "../hooks/useTransactions";
import type { Transaction } from "../hooks/useTransactions";
import { X } from "lucide-react";

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingTransaction?: Transaction | null;
}

export default function TransactionModal({
    isOpen,
    onClose,
    existingTransaction,
}: TransactionModalProps) {
    const [type, setType] = useState<"income" | "expense">("expense");
    // We use state for inputs to easily handle pre-filling
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const { addTransaction, updateTransaction } = useTransactions();

    useEffect(() => {
        if (existingTransaction) {
            setType(existingTransaction.type);
            setAmount(existingTransaction.amount.toString());
            setDescription(existingTransaction.description);
            setCategory(existingTransaction.category);
            setDate(existingTransaction.date);
        } else {
            // Reset defaults when opening in Add mode
            setType("expense");
            setAmount("");
            setDescription("");
            setCategory("");
            setDate(new Date().toISOString().split("T")[0]);
        }
    }, [existingTransaction, isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!amount || !description || !category || !date) return;

        if (existingTransaction) {
            await updateTransaction(existingTransaction.id, {
                type,
                amount: parseFloat(amount),
                description,
                category,
                date,
            });
        } else {
            await addTransaction(
                type,
                parseFloat(amount),
                description,
                category,
                date
            );
        }

        onClose();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>

                <h2 className="mb-4 text-xl font-bold text-gray-800">
                    {existingTransaction ? "Modifier la Transaction" : "Nouvelle Transaction"}
                </h2>
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
                            Dépense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("income")}
                            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${type === "income"
                                ? "bg-white text-green-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Revenu
                        </button>
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Montant
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
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
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Catégorie
                        </label>
                        <input
                            type="text"
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="Ex: Alimentation, Salaire"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                            Description
                        </label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            placeholder="Qu'est-ce que c'est ?"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded border border-gray-300 bg-white py-2 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 rounded py-2 font-bold text-white transition ${type === "expense"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                                }`}
                        >
                            {existingTransaction ? "Mettre à jour" : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
