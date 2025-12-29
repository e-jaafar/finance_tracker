import { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

export type Currency = "USD" | "EUR" | "GBP" | "MAD" | "CAD" | "CHF" | "JPY";

interface CurrencyInfo {
    code: Currency;
    symbol: string;
    name: string;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
    USD: { code: "USD", symbol: "$", name: "US Dollar" },
    EUR: { code: "EUR", symbol: "€", name: "Euro" },
    GBP: { code: "GBP", symbol: "£", name: "British Pound" },
    MAD: { code: "MAD", symbol: "DH", name: "Moroccan Dirham" },
    CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    CHF: { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
};

interface CurrencyContextType {
    currency: Currency;
    currencyInfo: CurrencyInfo;
    setCurrency: (currency: Currency) => Promise<void>;
    formatAmount: (amount: number) => string;
    loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }
    return context;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>("USD");
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    // Load user's preferred currency from Firestore using realtime listener
    useEffect(() => {
        if (!currentUser) {
            setCurrencyState("USD");
            setLoading(false);
            return;
        }

        const userDocRef = doc(db, "users", currentUser.uid, "settings", "preferences");
        
        const unsubscribe = onSnapshot(
            userDocRef,
            (docSnap) => {
                if (docSnap.exists() && docSnap.data().currency) {
                    setCurrencyState(docSnap.data().currency as Currency);
                }
                setLoading(false);
            },
            (error) => {
                console.warn("Currency preference unavailable, using default:", error.message);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, [currentUser]);

    // Save currency preference to Firestore
    async function setCurrency(newCurrency: Currency) {
        setCurrencyState(newCurrency); // Update locally first for instant feedback
        
        if (!currentUser) return;

        try {
            const userDocRef = doc(db, "users", currentUser.uid, "settings", "preferences");
            await setDoc(userDocRef, { currency: newCurrency }, { merge: true });
        } catch (error) {
            console.warn("Could not save currency preference:", error);
            // Don't throw - local state is already updated
        }
    }

    const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD;

    function formatAmount(amount: number): string {
        const formatter = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: currency === "JPY" ? 0 : 2,
            maximumFractionDigits: currency === "JPY" ? 0 : 2,
        });
        return formatter.format(amount);
    }

    return (
        <CurrencyContext.Provider value={{ currency, currencyInfo, setCurrency, formatAmount, loading }}>
            {children}
        </CurrencyContext.Provider>
    );
}
