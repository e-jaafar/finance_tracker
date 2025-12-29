import { useState, useEffect } from "react";
import {
    collection,
    doc,
    setDoc,
    onSnapshot,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export interface Budget {
    category: string;
    limit: number;
}

export function useBudgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setBudgets([]);
            setLoading(false);
            setError(null);
            return;
        }

        const collectionRef = collection(db, "users", currentUser.uid, "budgets");
        const unsubscribe = onSnapshot(
            collectionRef,
            (snapshot) => {
                const docs = snapshot.docs.map((doc) => ({
                    category: doc.id,
                    limit: doc.data().limit,
                })) as Budget[];
                setBudgets(docs);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore error:", err);
                setError("Erreur lors du chargement des budgets");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    async function setBudget(category: string, limit: number) {
        if (!currentUser) return;
        try {
            await setDoc(doc(db, "users", currentUser.uid, "budgets", category), {
                limit,
            });
        } catch (err) {
            console.error("Error setting budget:", err);
            throw new Error("Erreur lors de la définition du budget");
        }
    }

    async function removeBudget(category: string) {
        if (!currentUser) return;
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "budgets", category));
        } catch (err) {
            console.error("Error removing budget:", err);
            throw new Error("Erreur lors de la suppression du budget");
        }
    }

    return { budgets, loading, error, setBudget, removeBudget };
}
