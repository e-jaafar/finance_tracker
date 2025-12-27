import { useState } from "react";
import { PlusCircle } from "lucide-react";
import TransactionModal from "./TransactionModal";

export default function AddTransactionForm() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl fixed bottom-8 right-8 md:static md:w-auto z-40"
            >
                <PlusCircle size={20} /> Add
            </button>

            <TransactionModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
