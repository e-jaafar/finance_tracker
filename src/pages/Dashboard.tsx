import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { useRecurring } from "../hooks/useRecurring";
import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList, { TransactionListSkeleton } from "../components/TransactionList";
import FinancialCharts from "../components/FinancialCharts";
import TransactionFilters from "../components/TransactionFilters";
import BudgetGoals from "../components/BudgetGoals";
import RecurringManager from "../components/RecurringManager";
import TransactionModal from "../components/TransactionModal";
import type { Transaction } from "../hooks/useTransactions";
import { exportTransactionsToCSV } from "../utils/exportCsv";
import { LogOut, Wallet, User, Download, UserCircle } from "lucide-react";

export default function Dashboard() {
    const [error, setError] = useState("");
    const { currentUser, logout, isGuest } = useAuth();
    const { showToast } = useToast();
    const { formatAmount } = useCurrency();
    const { transactions, deleteTransaction, loading } = useTransactions();
    const { processDueTransactions } = useRecurring();
    const navigate = useNavigate();

    // Process recurring transactions on mount
    useEffect(() => {
        processDueTransactions();
    }, [processDueTransactions]);

    // Filter States
    const [currentMonth, setCurrentMonth] = useState("all");
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Edit State
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    function handleEditTransaction(transaction: Transaction) {
        setEditingTransaction(transaction);
        setIsEditModalOpen(true);
    }

    async function handleDeleteTransaction(id: string) {
        try {
            await deleteTransaction(id);
            showToast("Transaction deleted successfully", "success");
        } catch {
            showToast("Failed to delete transaction", "error");
        }
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
        <div className="min-h-screen bg-background pb-28 text-text-primary font-sans selection:bg-primary selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-xl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
                                <Wallet size={20} />
                            </div>
                            <h1 className="text-lg font-bold tracking-tight text-white hidden md:block">
                                Finance<span className="text-indigo-400">Tracker</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 mr-4">
                                {isGuest ? (
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md">
                                        <UserCircle size={14} />
                                        Guest
                                    </span>
                                ) : (
                                    <span className="text-xs font-medium text-text-secondary hidden md:block">
                                        {currentUser?.email}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => navigate("/profile")}
                                className="group flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface px-4 text-sm font-medium text-text-secondary transition-all hover:bg-surfaceHighlight hover:text-white hover:border-white/20"
                            >
                                <User size={16} className="text-indigo-400 group-hover:text-indigo-300" />
                                <span className="hidden sm:inline">{isGuest ? "Create Account" : "Profile"}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="group flex h-9 items-center justify-center gap-2 rounded-lg border border-white/10 bg-surface px-4 text-sm font-medium text-text-secondary transition-all hover:bg-surfaceHighlight hover:text-white hover:border-white/20"
                            >
                                <LogOut size={16} className="text-red-400 group-hover:text-red-300" />
                                <span className="hidden sm:inline">Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {error && (
                    <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-200">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-3 mb-10">
                    {/* Total Balance */}
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-2xl">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/5 blur-2xl"></div>
                        <h3 className="mb-1 text-sm font-medium text-slate-400">Total Balance</h3>
                        <p className="text-4xl font-extrabold tracking-tight text-white">{formatAmount(balance)}</p>
                    </div>

                    {/* Income */}
                    <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-xl relative group transition-all hover:border-white/10">
                        <div className="absolute top-6 right-6 p-2 rounded-lg bg-green-500/10 text-green-400">
                            <div className="w-4 h-4 rounded-full bg-green-500/20 animate-pulse absolute inset-0 m-auto"></div>
                            <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                        </div>
                        <h3 className="mb-1 text-sm font-medium text-text-muted">Total Income</h3>
                        <p className="text-3xl font-bold text-green-400">+{formatAmount(income)}</p>
                    </div>

                    {/* Expenses */}
                    <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-xl relative group transition-all hover:border-white/10">
                        <div className="absolute top-6 right-6 p-2 rounded-lg bg-red-500/10 text-red-400">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                        </div>
                        <h3 className="mb-1 text-sm font-medium text-text-muted">Total Expenses</h3>
                        <p className="text-3xl font-bold text-red-400">-{formatAmount(expense)}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-8">
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
                </div>

                {/* Content Grid */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column (Main Content) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Charts */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 rounded-full bg-indigo-500"></span>
                                Financial Overview
                            </h2>
                            <FinancialCharts transactions={filteredTransactions} />
                        </section>

                        {/* Recent Transactions */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-1 h-6 rounded-full bg-purple-500"></span>
                                    Recent Transactions
                                </h2>
                                <button
                                    onClick={() => exportTransactionsToCSV(filteredTransactions)}
                                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-surfaceHighlight hover:text-white hover:border-white/20 transition-all"
                                >
                                    <Download size={14} />
                                    <span>Export CSV</span>
                                </button>
                            </div>

                            {loading ? (
                                <TransactionListSkeleton />
                            ) : (
                                <TransactionList
                                    transactions={filteredTransactions}
                                    onDelete={handleDeleteTransaction}
                                    onEdit={handleEditTransaction}
                                />
                            )}
                        </section>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-8">
                        <BudgetGoals transactions={filteredTransactions} />
                        <RecurringManager />
                    </div>
                </div>
            </main>

            {/* Floating Action Button */}
            <AddTransactionForm />

            {/* Edit Modal */}
            <TransactionModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTransaction(null);
                }}
                existingTransaction={editingTransaction}
            />
        </div>
    );
}
