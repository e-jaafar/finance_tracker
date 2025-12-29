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
import EmptyState from "./EmptyState";
import { PieChart } from "lucide-react";

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

    const { incomeTotal, expenseTotal, expenseByCategory } = useMemo(() => {
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

        return {
            incomeTotal: income,
            expenseTotal: expense,
            expenseByCategory: categoryMap
        };
    }, [transactions]);

    // Helper to get color for a category name
    const getCategoryColor = (name: string) => {
        const cat = categories.find(c => c.name === name);
        return cat ? cat.color : "#64748b"; // Default slate if not found
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
                label: "Amount ($)",
                data: [incomeTotal, expenseTotal],
                backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(239, 68, 68, 0.8)"], // More opaque for dark mode
                borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
                borderWidth: 0,
                borderRadius: 4,
            },
        ],
    };

    const categoryNames = Object.keys(expenseByCategory);
    const doughnutData = {
        labels: categoryNames,
        datasets: [
            {
                label: "Expenses by Category",
                data: Object.values(expenseByCategory),
                backgroundColor: categoryNames.map(name => getCategoryColor(name)),
                borderColor: '#1e1e26', // Match surface background for unified look
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
                position: 'right' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    boxWidth: 8,
                }
            }
        },
        cutout: '70%',
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
                <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-text-muted">
                    Expense Breakdown
                </h3>
                <div className="h-64 flex justify-center">
                    <Doughnut data={doughnutData} options={{ ...doughnutOptions, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}
