import { useState, useEffect, useRef } from "react";
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    serverTimestamp,
    writeBatch,
    getDocs,
    updateDoc
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
    
    // Flags to prevent double initialization during reset or initial load
    const isResettingRef = useRef(false);
    const isInitializingRef = useRef(false);

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

                // If no categories exist and we're not in the middle of a reset or initialization, initialize defaults
                if (docs.length === 0 && !snapshot.metadata.fromCache && !isResettingRef.current && !isInitializingRef.current) {
                    isInitializingRef.current = true;
                    initializeDefaults(currentUser.uid).finally(() => {
                        isInitializingRef.current = false;
                    });
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

    async function resetToDefaults() {
        if (!currentUser) return;
        
        // Set flag to prevent onSnapshot from re-initializing
        isResettingRef.current = true;
        
        try {
            const collectionRef = collection(db, "users", currentUser.uid, "categories");
            
            // Delete all existing categories
            const snapshot = await getDocs(collectionRef);
            const batch = writeBatch(db);
            
            snapshot.docs.forEach((document) => {
                batch.delete(doc(db, "users", currentUser.uid, "categories", document.id));
            });
            
            // Add all default categories
            DEFAULT_CATEGORIES.forEach(cat => {
                const docRef = doc(collectionRef);
                batch.set(docRef, { ...cat, isDefault: true, createdAt: serverTimestamp() });
            });
            
            await batch.commit();
        } catch (err) {
            console.error("Error resetting categories:", err);
            throw new Error("Erreur lors de la réinitialisation des catégories");
        } finally {
            // Reset flag after operation completes
            isResettingRef.current = false;
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

    async function updateCategory(id: string, data: Partial<Omit<Category, "id">>) {
        if (!currentUser) return;
        try {
            await updateDoc(doc(db, "users", currentUser.uid, "categories", id), {
                ...data,
                updatedAt: serverTimestamp(),
            });
        } catch (err) {
            console.error("Error updating category:", err);
            throw new Error("Erreur lors de la mise à jour de la catégorie");
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

    return { categories, loading, error, addCategory, updateCategory, deleteCategory, resetToDefaults };
}
