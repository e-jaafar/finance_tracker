import { useState } from "react";
import { PlusCircle } from "lucide-react";
import TransactionModal from "./TransactionModal";

export default function AddTransactionForm() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-105 hover:shadow-indigo-600/50 fixed bottom-8 right-8 z-50"
            >
                <PlusCircle size={20} /> Add Transaction
            </button>

            <TransactionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
