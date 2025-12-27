import React, { useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList from "../components/TransactionList";
import FinancialCharts from "../components/FinancialCharts";
import TransactionFilters from "../components/TransactionFilters";
import BudgetGoals from "../components/BudgetGoals";
import { LogOut, Wallet } from "lucide-react";

export default function Dashboard() {
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const { transactions, deleteTransaction, loading } = useTransactions();
    const navigate = useNavigate();

    // Filter States
    const [currentMonth, setCurrentMonth] = useState("all");
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Derive Available Categories
    const availableCategories = useMemo(() => {
        const categories = new Set(transactions.map(t => t.category));
        return Array.from(categories).sort();
    }, [transactions]);

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            const tMonth = tDate.getMonth().toString();
            const tYear = tDate.getFullYear().toString();

            const matchMonth = currentMonth === "all" || tMonth === currentMonth;
            const matchYear = tYear === currentYear;
            const matchCategory = selectedCategory === "all" || t.category === selectedCategory;

            return matchMonth && matchYear && matchCategory;
        });
    }, [transactions, currentMonth, currentYear, selectedCategory]);

    // Calculate Totals based on Filtered Data
    const { balance, income, expense } = useMemo(() => {
        let inc = 0;
        let exp = 0;
        filteredTransactions.forEach(t => {
            if (t.type === 'income') inc += t.amount;
            else exp += t.amount;
        });
        return { balance: inc - exp, income: inc, expense: exp };
    }, [filteredTransactions]);

    function handleResetFilters() {
        setCurrentMonth("all");
        setCurrentYear(new Date().getFullYear().toString());
        setSelectedCategory("all");
    }

    async function handleLogout() {
        setError("");
        try {
            await logout();
            navigate("/login");
        } catch {
            setError("Failed to log out");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <Wallet size={24} />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800 hidden md:block">FinanceTracker</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden md:inline">
                                {currentUser?.email}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                            >
                                <LogOut size={16} />
                                <span className="hidden md:inline">Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-8">
                {error && (
                    <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700 border border-red-200 shadow-sm">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
                        <h3 className="mb-2 text-blue-100 font-medium">Total Balance</h3>
                        <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                        <h3 className="mb-2 text-gray-500 font-medium uppercase text-xs">Total Income</h3>
                        <p className="text-3xl font-bold text-green-600">+${income.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
                        <h3 className="mb-2 text-gray-500 font-medium uppercase text-xs">Total Expenses</h3>
                        <p className="text-3xl font-bold text-red-600">-${expense.toFixed(2)}</p>
                    </div>
                </div>

                {/* Filters */}
                <TransactionFilters
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    selectedCategory={selectedCategory}
                    availableCategories={availableCategories}
                    onMonthChange={(e) => setCurrentMonth(e.target.value)}
                    onYearChange={(e) => setCurrentYear(e.target.value)}
                    onCategoryChange={(e) => setSelectedCategory(e.target.value)}
                    onReset={handleResetFilters}
                />

                {/* Charts Section */}
                <div className="mb-8 grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Financial Overview</h2>
                        <FinancialCharts transactions={filteredTransactions} />
                    </div>
                    <div>
                        <BudgetGoals transactions={filteredTransactions} />
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
                        </div>
                        {/* Pass loading state if needed by the component, but we removed it. 
                Wait, TransactionList might still want to know about loading? 
                Actually, if useTransactions returns empty initially, the list is empty. 
                Ideally Dashboard handles loading UI. 
            */}
                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading transactions...</div>
                        ) : (
                            <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
                        )}

                    </div>
                    <div>
                        {/* Optional sidebar content or tips could go here */}
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <AddTransactionForm />
        </div>
    );
}
