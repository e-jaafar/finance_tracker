import { useState, useEffect } from "react";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    serverTimestamp,
    where
} from "firebase/firestore";
import type { WhereFilterOp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export interface Transaction {
    id: string;
    type: "income" | "expense";
    amount: number;
    description: string;
    category: string;
    date: string;
}

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const collectionRef = collection(db, "users", currentUser.uid, "transactions");
        const q = query(collectionRef, orderBy("date", "desc"), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Transaction[];
            setTransactions(docs);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    async function addTransaction(
        type: "income" | "expense",
        amount: number,
        description: string,
        category: string,
        date: string
    ) {
        if (!currentUser) return;

        await addDoc(collection(db, "users", currentUser.uid, "transactions"), {
            type,
            amount,
            description,
            category,
            date,
            createdAt: serverTimestamp(),
        });
    }

    async function deleteTransaction(id: string) {
        if (!currentUser) return;
        await deleteDoc(doc(db, "users", currentUser.uid, "transactions", id));
    }

    return { transactions, loading, addTransaction, deleteTransaction };
}
