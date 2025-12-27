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
                backgroundColor: ["rgba(34, 197, 94, 0.6)", "rgba(239, 68, 68, 0.6)"],
                borderColor: ["rgb(34, 197, 94)", "rgb(239, 68, 68)"],
                borderWidth: 1,
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
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-center font-bold text-gray-700">
                    Income vs Expenses
                </h3>
                <div className="h-64">
                    <Bar data={barData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-center font-bold text-gray-700">
                    Expense Breakdown
                </h3>
                <div className="h-64 flex justify-center">
                    <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}
