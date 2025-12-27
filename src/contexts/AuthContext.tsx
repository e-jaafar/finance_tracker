import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateEmail,
    updatePassword
} from "firebase/auth";
import type { User } from "firebase/auth";

interface AuthContextType {
    currentUser: User | null;
    signup: (email: string, pass: string) => Promise<any>;
    login: (email: string, pass: string) => Promise<any>;
    logout: () => Promise<void>;
    updateUserEmail: (email: string) => Promise<void>;
    updateUserPassword: (password: string) => Promise<void>;
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

    function signup(email: string, pass: string) {
        return createUserWithEmailAndPassword(auth, email, pass);
    }

    function login(email: string, pass: string) {
        return signInWithEmailAndPassword(auth, email, pass);
    }

    function logout() {
        return signOut(auth);
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
        signup,
        login,
        logout,
        updateUserEmail,
        updateUserPassword,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
