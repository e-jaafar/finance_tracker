import { useState, useEffect, useCallback } from "react";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    serverTimestamp,
    updateDoc,
    limit,
    startAfter,
    getDocs
} from "firebase/firestore";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
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

const TRANSACTIONS_PER_PAGE = 50;

export function useTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            setError(null);
            return;
        }

        const collectionRef = collection(db, "users", currentUser.uid, "transactions");
        const q = query(
            collectionRef,
            orderBy("date", "desc"),
            orderBy("createdAt", "desc"),
            limit(TRANSACTIONS_PER_PAGE)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const docs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Transaction[];
                setTransactions(docs);
                setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
                setHasMore(snapshot.docs.length === TRANSACTIONS_PER_PAGE);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore error:", err);
                setError("Erreur lors du chargement des transactions");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    const loadMore = useCallback(async () => {
        if (!currentUser || !lastDoc || !hasMore) return;

        try {
            const collectionRef = collection(db, "users", currentUser.uid, "transactions");
            const q = query(
                collectionRef,
                orderBy("date", "desc"),
                orderBy("createdAt", "desc"),
                startAfter(lastDoc),
                limit(TRANSACTIONS_PER_PAGE)
            );

            const snapshot = await getDocs(q);
            const newDocs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Transaction[];

            setTransactions((prev) => [...prev, ...newDocs]);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === TRANSACTIONS_PER_PAGE);
        } catch (err) {
            console.error("Error loading more transactions:", err);
            setError("Erreur lors du chargement des transactions");
        }
    }, [currentUser, lastDoc, hasMore]);

    async function addTransaction(transaction: Omit<Transaction, "id">) {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, "users", currentUser.uid, "transactions"), {
                ...transaction,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error adding transaction:", err);
            throw new Error("Erreur lors de l'ajout de la transaction");
        }
    }

    async function deleteTransaction(id: string) {
        if (!currentUser) return;
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "transactions", id));
        } catch (err) {
            console.error("Error deleting transaction:", err);
            throw new Error("Erreur lors de la suppression de la transaction");
        }
    }

    async function updateTransaction(
        id: string,
        updates: Partial<Omit<Transaction, "id" | "createdAt">>
    ) {
        if (!currentUser) return;
        try {
            await updateDoc(doc(db, "users", currentUser.uid, "transactions", id), updates);
        } catch (err) {
            console.error("Error updating transaction:", err);
            throw new Error("Erreur lors de la mise à jour de la transaction");
        }
    }

    return {
        transactions,
        loading,
        error,
        hasMore,
        loadMore,
        addTransaction,
        deleteTransaction,
        updateTransaction
    };
}
