import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

export type Currency = "USD" | "EUR" | "GBP" | "MAD" | "CAD" | "CHF" | "JPY";

interface CurrencyInfo {
    code: Currency;
    symbol: string;
    name: string;
}

export const CURRENCIES: CurrencyInfo[] = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "MAD", symbol: "DH", name: "Moroccan Dirham" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

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

    // Load user's preferred currency from Firestore
    useEffect(() => {
        async function loadCurrency() {
            if (!currentUser) {
                setCurrencyState("USD");
                setLoading(false);
                return;
            }

            try {
                const userDocRef = doc(db, "users", currentUser.uid, "settings", "preferences");
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists() && userDoc.data().currency) {
                    setCurrencyState(userDoc.data().currency as Currency);
                }
            } catch (error) {
                console.error("Error loading currency preference:", error);
            }
            setLoading(false);
        }

        loadCurrency();
    }, [currentUser]);

    // Save currency preference to Firestore
    async function setCurrency(newCurrency: Currency) {
        if (!currentUser) return;

        try {
            const userDocRef = doc(db, "users", currentUser.uid, "settings", "preferences");
            await setDoc(userDocRef, { currency: newCurrency }, { merge: true });
            setCurrencyState(newCurrency);
        } catch (error) {
            console.error("Error saving currency preference:", error);
            throw new Error("Failed to save currency preference");
        }
    }

    const currencyInfo = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

    function formatAmount(amount: number): string {
        // Format based on currency
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
