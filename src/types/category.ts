export interface Category {
    id: string;
    name: string;
    type: "income" | "expense";
    color: string;
    icon: string; // Identifier for Lucide icon
    isDefault?: boolean;
}

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
    { name: "Salary", type: "income", color: "#10b981", icon: "Wallet" },
    { name: "Freelance", type: "income", color: "#3b82f6", icon: "Briefcase" },
    { name: "Investments", type: "income", color: "#8b5cf6", icon: "TrendingUp" },
    { name: "Food", type: "expense", color: "#f59e0b", icon: "Utensils" },
    { name: "Transport", type: "expense", color: "#ef4444", icon: "Car" },
    { name: "Housing", type: "expense", color: "#6366f1", icon: "Home" },
    { name: "Utilities", type: "expense", color: "#06b6d4", icon: "Zap" },
    { name: "Entertainment", type: "expense", color: "#ec4899", icon: "Film" },
    { name: "Health", type: "expense", color: "#14b8a6", icon: "Heart" },
    { name: "Shopping", type: "expense", color: "#f43f5e", icon: "ShoppingBag" },
];
