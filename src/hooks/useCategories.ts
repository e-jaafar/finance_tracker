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
    writeBatch,
    getDocs,
    updateDoc,
    getDoc,
    setDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { DEFAULT_CATEGORIES } from "../types/category";
import type { Category } from "../types/category";

// Global flag to prevent multiple initializations across all hook instances
const initializingUsers = new Set<string>();

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

        const userId = currentUser.uid;
        const collectionRef = collection(db, "users", userId, "categories");
        const q = query(collectionRef, orderBy("name"));

        const unsubscribe = onSnapshot(
            q,
            async (snapshot) => {
                const docs = snapshot.docs.map((d) => ({
                    id: d.id,
                    ...d.data(),
                })) as Category[];

                // If no categories and not from cache, check if we need to initialize
                if (docs.length === 0 && !snapshot.metadata.fromCache) {
                    // Check if already initializing for this user
                    if (!initializingUsers.has(userId)) {
                        initializingUsers.add(userId);
                        try {
                            await initializeDefaults(userId);
                        } finally {
                            initializingUsers.delete(userId);
                        }
                    }
                    // Don't set categories yet, wait for next snapshot with data
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
            // Double-check: verify no categories exist before creating
            const collectionRef = collection(db, "users", userId, "categories");
            const existingDocs = await getDocs(collectionRef);
            
            if (existingDocs.size > 0) {
                // Categories already exist, don't create duplicates
                return;
            }

            // Use a marker document to prevent race conditions
            const markerRef = doc(db, "users", userId, "_meta", "categoriesInitialized");
            const markerDoc = await getDoc(markerRef);
            
            if (markerDoc.exists()) {
                // Already initialized by another instance
                return;
            }

            // Set marker first to claim initialization
            await setDoc(markerRef, { initializedAt: serverTimestamp() });

            // Now create categories
            const batch = writeBatch(db);
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
        
        const userId = currentUser.uid;
        initializingUsers.add(userId); // Prevent onSnapshot from re-initializing
        
        try {
            const collectionRef = collection(db, "users", userId, "categories");
            
            // Delete all existing categories
            const snapshot = await getDocs(collectionRef);
            const batch = writeBatch(db);
            
            snapshot.docs.forEach((document) => {
                batch.delete(doc(db, "users", userId, "categories", document.id));
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
            initializingUsers.delete(userId);
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
