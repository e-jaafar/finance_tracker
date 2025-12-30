import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import type { Transaction } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { useCurrency } from "../contexts/CurrencyContext";
import EmptyState from "./EmptyState";
import { PieChart } from "lucide-react";
import * as LucideIcons from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Ensure global chart defaults work for dark mode
ChartJS.defaults.color = '#a1a1aa'; // text-secondary
ChartJS.defaults.borderColor = '#272730'; // surfaceHighlight

interface FinancialChartsProps {
    transactions: Transaction[];
}

export default function FinancialCharts({ transactions }: FinancialChartsProps) {

    const { categories } = useCategories();
    const { currencyInfo, formatAmount } = useCurrency();

    const { incomeTotal, expenseTotal, sortedCategories } = useMemo(() => {
        let income = 0;
        let expense = 0;
        const categoryMap: { [key: string]: number } = {};

        transactions.forEach((t) => {
            if (t.type === "income") {
                income += t.amount;
            } else {
                expense += t.amount;
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            }
        });

        // Sort categories by amount (descending)
        const sorted = Object.entries(categoryMap)
            .sort(([, a], [, b]) => b - a)
            .map(([name, amount]) => ({
                name,
                amount,
                percentage: expense > 0 ? (amount / expense) * 100 : 0
            }));

        return {
            incomeTotal: income,
            expenseTotal: expense,
            sortedCategories: sorted
        };
    }, [transactions]);

    // Helper to get color for a category name
    const getCategoryColor = (name: string) => {
        const cat = categories.find(c => c.name === name);
        return cat ? cat.color : "#64748b"; // Default slate if not found
    };

    // Helper to get icon for a category name
    const getCategoryIcon = (name: string) => {
        const cat = categories.find(c => c.name === name);
        const iconName = cat?.icon || "HelpCircle";
        // @ts-ignore
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return Icon;
    };

    if (transactions.length === 0) {
        return (
            <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-lg">
                <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-text-muted">
                    Financial Overview
                </h3>
                <EmptyState
                    icon={PieChart}
                    title="No data to visualize"
                    description="Add some transactions to see your personalized financial insights and breakdowns."
                />
            </div>
        );
    }

    const barData = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                label: `Amount (${currencyInfo.symbol})`,
                data: [incomeTotal, expenseTotal],
                backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"],
                borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
                borderWidth: 0,
                borderRadius: 4,
            },
        ],
    };

    const categoryNames = sortedCategories.map(c => c.name);
    const doughnutData = {
        labels: categoryNames,
        datasets: [
            {
                label: "Expenses by Category",
                data: sortedCategories.map(c => c.amount),
                backgroundColor: categoryNames.map(name => getCategoryColor(name)),
                borderColor: '#1e1e26',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // We'll show our own legend
            },
            tooltip: {
                callbacks: {
                    label: (context: { parsed: number; label: string }) => {
                        const value = context.parsed;
                        const percentage = expenseTotal > 0 ? ((value / expenseTotal) * 100).toFixed(1) : 0;
                        return `${context.label}: ${formatAmount(value)} (${percentage}%)`;
                    }
                }
            }
        },
        cutout: '65%',
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-lg">
                <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-text-muted">
                    Income vs Expenses
                </h3>
                <div className="h-64">
                    <Bar data={barData} options={{ ...options, maintainAspectRatio: false }} />
                </div>
            </div>
            <div className="rounded-2xl border border-white/5 bg-surface p-6 shadow-lg">
                <h3 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-text-muted">
                    Expense Breakdown
                </h3>
                
                {sortedCategories.length === 0 ? (
                    <div className="h-64 flex items-center justify-center">
                        <p className="text-text-muted text-sm">No expenses recorded yet</p>
                    </div>
                ) : (
                    <div className="flex gap-4 h-64">
                        {/* Donut Chart - Left Side */}
                        <div className="w-1/2 flex items-center justify-center relative">
                            <Doughnut data={doughnutData} options={{ ...doughnutOptions, maintainAspectRatio: false }} />
                            {/* Center text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-text-muted uppercase">Total</span>
                                <span className="text-lg font-bold text-white">{formatAmount(expenseTotal)}</span>
                            </div>
                        </div>
                        
                        {/* Category List - Right Side */}
                        <div className="w-1/2 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                            {sortedCategories.slice(0, 6).map((cat) => {
                                const Icon = getCategoryIcon(cat.name);
                                const color = getCategoryColor(cat.name);
                                return (
                                    <div key={cat.name} className="flex items-center gap-2 group">
                                        <div 
                                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: `${color}20` }}
                                        >
                                            <Icon size={14} style={{ color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-medium text-white truncate">{cat.name}</span>
                                                <span className="text-xs text-text-muted flex-shrink-0">{cat.percentage.toFixed(0)}%</span>
                                            </div>
                                            <div className="mt-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{ 
                                                        width: `${cat.percentage}%`,
                                                        backgroundColor: color 
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedCategories.length > 6 && (
                                <p className="text-xs text-text-muted text-center pt-1">
                                    +{sortedCategories.length - 6} more categories
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
