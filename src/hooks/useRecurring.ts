import { useState, useEffect, useCallback, useRef } from "react";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
    Timestamp
} from "firebase/firestore";
import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import type { RecurringTransaction, Frequency } from "../types/recurring";
import { processRecurringTransactions } from "../services/recurringService";

export function useRecurring() {
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const hasProcessedRef = useRef(false);
    const { currentUser } = useAuth();

    // Listen to recurring transactions in real-time
    useEffect(() => {
        if (!currentUser) {
            setRecurringTransactions([]);
            setLoading(false);
            setError(null);
            return;
        }

        const collectionRef = collection(db, "users", currentUser.uid, "recurring_transactions");
        const q = query(collectionRef, orderBy("nextDueDate", "asc"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const docs = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as RecurringTransaction[];
                setRecurringTransactions(docs);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore error:", err);
                setError("Erreur lors du chargement des transactions récurrentes");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    // Process due recurring transactions (create actual transactions)
    const processDueTransactions = useCallback(async () => {
        if (!currentUser || hasProcessedRef.current) return;

        hasProcessedRef.current = true;
        setProcessing(true);
        try {
            await processRecurringTransactions(currentUser.uid);
        } catch (err) {
            console.error("Error processing recurring transactions:", err);
            setError("Erreur lors du traitement des transactions récurrentes");
        }
        setProcessing(false);
    }, [currentUser]);

    // Reset hasProcessed when user changes
    useEffect(() => {
        hasProcessedRef.current = false;
    }, [currentUser]);

    // Force process (for manual refresh button)
    const forceProcessDueTransactions = useCallback(async () => {
        if (!currentUser || processing) return;

        setProcessing(true);
        try {
            await processRecurringTransactions(currentUser.uid);
        } catch (err) {
            console.error("Error processing recurring transactions:", err);
            setError("Erreur lors du traitement des transactions récurrentes");
        }
        setProcessing(false);
    }, [currentUser, processing]);

    // Add a new recurring transaction
    async function addRecurring(data: {
        amount: number;
        category: string;
        description: string;
        type: "income" | "expense";
        frequency: Frequency;
        startDate: Date;
    }) {
        if (!currentUser) return;

        try {
            const startTimestamp = Timestamp.fromDate(data.startDate);
            
            // Calculate next due date (first occurrence is the start date)
            const nextDueDate = Timestamp.fromDate(data.startDate);

            await addDoc(collection(db, "users", currentUser.uid, "recurring_transactions"), {
                amount: data.amount,
                category: data.category,
                description: data.description,
                type: data.type,
                frequency: data.frequency,
                startDate: startTimestamp,
                nextDueDate: nextDueDate,
                userId: currentUser.uid,
                isActive: true
            });
        } catch (err) {
            console.error("Error adding recurring transaction:", err);
            throw new Error("Erreur lors de l'ajout de la transaction récurrente");
        }
    }

    // Toggle active status
    async function toggleActive(id: string, isActive: boolean) {
        if (!currentUser) return;

        try {
            await updateDoc(doc(db, "users", currentUser.uid, "recurring_transactions", id), {
                isActive: !isActive
            });
        } catch (err) {
            console.error("Error toggling recurring transaction:", err);
            throw new Error("Erreur lors de la mise à jour");
        }
    }

    // Delete a recurring transaction
    async function deleteRecurring(id: string) {
        if (!currentUser) return;

        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "recurring_transactions", id));
        } catch (err) {
            console.error("Error deleting recurring transaction:", err);
            throw new Error("Erreur lors de la suppression");
        }
    }

    return {
        recurringTransactions,
        loading,
        error,
        processing,
        processDueTransactions,
        forceProcessDueTransactions,
        addRecurring,
        toggleActive,
        deleteRecurring
    };
}
