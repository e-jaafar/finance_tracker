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

    const doughnutData = {
        labels: Object.keys(expenseByCategory),
        datasets: [
            {
                label: "Expenses by Category",
                data: Object.values(expenseByCategory),
                backgroundColor: [
                    "rgba(99, 102, 241, 0.8)", // Indigo
                    "rgba(236, 72, 153, 0.8)", // Pink
                    "rgba(245, 158, 11, 0.8)", // Amber
                    "rgba(16, 185, 129, 0.8)", // Emerald
                    "rgba(139, 92, 246, 0.8)", // Violet
                    "rgba(59, 130, 246, 0.8)", // Blue
                ],
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
