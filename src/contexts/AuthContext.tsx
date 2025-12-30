import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateEmail,
    updatePassword,
    signInWithPopup,
    signInAnonymously,
    linkWithCredential,
    EmailAuthProvider
} from "firebase/auth";
import type { User } from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    isGuest: boolean;
    signup: (email: string, pass: string) => Promise<any>;
    login: (email: string, pass: string) => Promise<any>;
    logout: () => Promise<void>;
    updateUserEmail: (email: string) => Promise<void>;
    updateUserPassword: (password: string) => Promise<void>;
    signInWithGoogle: () => Promise<any>;
    signInAsGuest: () => Promise<any>;
    linkGuestAccount: (email: string, password: string) => Promise<any>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is anonymous (guest)
    const isGuest = currentUser?.isAnonymous ?? false;

    function signup(email: string, pass: string) {
        return createUserWithEmailAndPassword(auth, email, pass);
    }

    function login(email: string, pass: string) {
        return signInWithEmailAndPassword(auth, email, pass);
    }

    function logout() {
        return signOut(auth);
    }

    function signInWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function signInAsGuest() {
        return signInAnonymously(auth);
    }

    async function linkGuestAccount(email: string, password: string) {
        if (!currentUser) throw new Error("No user logged in");
        if (!currentUser.isAnonymous) throw new Error("User is not a guest");
        
        const credential = EmailAuthProvider.credential(email, password);
        return linkWithCredential(currentUser, credential);
    }

    function updateUserEmail(email: string) {
        if (!currentUser) throw new Error("No user logged in");
        return updateEmail(currentUser, email);
    }

    function updateUserPassword(password: string) {
        if (!currentUser) throw new Error("No user logged in");
        return updatePassword(currentUser, password);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        isGuest,
        signup,
        login,
        logout,
        updateUserEmail,
        updateUserPassword,
        signInWithGoogle,
        signInAsGuest,
        linkGuestAccount,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
