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
    writeBatch
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { DEFAULT_CATEGORIES } from "../types/category";
import type { Category } from "../types/category";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            setCategories([]);
            setLoading(false);
            setError(null);
            return;
        }

        const collectionRef = collection(db, "users", currentUser.uid, "categories");
        const q = query(collectionRef, orderBy("name"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const docs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Category[];

                // If no categories exist, initialize defaults
                if (docs.length === 0 && !snapshot.metadata.fromCache) {
                    initializeDefaults(currentUser.uid);
                } else {
                    setCategories(docs);
                }

                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error("Firestore error:", err);
                setError("Erreur lors du chargement des catégories");
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    async function initializeDefaults(userId: string) {
        try {
            const batch = writeBatch(db);
            const collectionRef = collection(db, "users", userId, "categories");

            DEFAULT_CATEGORIES.forEach(cat => {
                const docRef = doc(collectionRef);
                batch.set(docRef, { ...cat, isDefault: true, createdAt: serverTimestamp() });
            });

            await batch.commit();
        } catch (err) {
            console.error("Error initializing default categories:", err);
            setError("Erreur lors de l'initialisation des catégories");
        }
    }

    async function addCategory(category: Omit<Category, "id">) {
        if (!currentUser) return;
        try {
            await addDoc(collection(db, "users", currentUser.uid, "categories"), {
                ...category,
                createdAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error adding category:", err);
            throw new Error("Erreur lors de l'ajout de la catégorie");
        }
    }

    async function deleteCategory(id: string) {
        if (!currentUser) return;
        try {
            await deleteDoc(doc(db, "users", currentUser.uid, "categories", id));
        } catch (err) {
            console.error("Error deleting category:", err);
            throw new Error("Erreur lors de la suppression de la catégorie");
        }
    }

    return { categories, loading, error, addCategory, deleteCategory };
}
