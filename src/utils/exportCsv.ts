import type { Transaction } from "../hooks/useTransactions";

export function exportTransactionsToCSV(transactions: Transaction[]) {
    if (transactions.length === 0) return;

    // Define headers
    const headers = ["Date", "Description", "Category", "Type", "Amount"];

    // Format data
    const rows = transactions.map((t) => [
        t.date,
        `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
        `"${t.category.replace(/"/g, '""')}"`,
        t.type,
        t.amount.toFixed(2),
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(","))
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
