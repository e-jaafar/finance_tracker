export interface Category {
    id: string;
    name: string;
    type: "income" | "expense" | "both";
    color: string;
    icon: string; // Identifier for Lucide icon
    isDefault?: boolean;
}

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
    // Income
    { name: "Salary", type: "income", color: "#10b981", icon: "Wallet" },
    { name: "Freelance", type: "income", color: "#3b82f6", icon: "Briefcase" },
    { name: "Investments", type: "income", color: "#8b5cf6", icon: "TrendingUp" },
    { name: "Gifts", type: "both", color: "#f472b6", icon: "Gift" },
    { name: "Refunds", type: "income", color: "#22d3ee", icon: "RotateCcw" },
    
    // Expenses
    { name: "Food & Dining", type: "expense", color: "#f59e0b", icon: "Utensils" },
    { name: "Groceries", type: "expense", color: "#84cc16", icon: "ShoppingCart" },
    { name: "Transport", type: "expense", color: "#ef4444", icon: "Car" },
    { name: "Housing", type: "expense", color: "#6366f1", icon: "Home" },
    { name: "Utilities", type: "expense", color: "#06b6d4", icon: "Zap" },
    { name: "Entertainment", type: "expense", color: "#ec4899", icon: "Film" },
    { name: "Health", type: "expense", color: "#14b8a6", icon: "Heart" },
    { name: "Shopping", type: "expense", color: "#f43f5e", icon: "ShoppingBag" },
    { name: "Education", type: "expense", color: "#a855f7", icon: "GraduationCap" },
    { name: "Subscriptions", type: "expense", color: "#0ea5e9", icon: "CreditCard" },
    { name: "Insurance", type: "expense", color: "#64748b", icon: "Shield" },
    { name: "Travel", type: "expense", color: "#f97316", icon: "Plane" },
    { name: "Personal Care", type: "expense", color: "#e879f9", icon: "Sparkles" },
    { name: "Pets", type: "expense", color: "#fbbf24", icon: "PawPrint" },
    { name: "Other", type: "both", color: "#94a3b8", icon: "MoreHorizontal" },
];
