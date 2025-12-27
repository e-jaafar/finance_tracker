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
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setBudgets([]);
            setLoading(false);
            return;
        }

        const collectionRef = collection(db, "users", currentUser.uid, "budgets");
        const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                category: doc.id,
                limit: doc.data().limit,
            })) as Budget[];
            setBudgets(docs);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    async function setBudget(category: string, limit: number) {
        if (!currentUser) return;
        await setDoc(doc(db, "users", currentUser.uid, "budgets", category), {
            limit,
        });
    }

    async function removeBudget(category: string) {
        if (!currentUser) return;
        await deleteDoc(doc(db, "users", currentUser.uid, "budgets", category));
    }

    return { budgets, loading, setBudget, removeBudget };
}
