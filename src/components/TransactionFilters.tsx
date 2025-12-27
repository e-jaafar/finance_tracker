import { Filter, X } from "lucide-react";

interface TransactionFiltersProps {
    currentMonth: string;
    currentYear: string;
    selectedCategory: string;
    availableCategories: string[];
    onMonthChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onReset: () => void;
}

export default function TransactionFilters({
    currentMonth,
    currentYear,
    selectedCategory,
    availableCategories,
    onMonthChange,
    onYearChange,
    onCategoryChange,
    onReset,
}: TransactionFiltersProps) {
    const months = [
        { value: "all", label: "All Months" },
        { value: "0", label: "January" },
        { value: "1", label: "February" },
        { value: "2", label: "March" },
        { value: "3", label: "April" },
        { value: "4", label: "May" },
        { value: "5", label: "June" },
        { value: "6", label: "July" },
        { value: "7", label: "August" },
        { value: "8", label: "September" },
        { value: "9", label: "October" },
        { value: "10", label: "November" },
        { value: "11", label: "December" },
    ];

    const currentYearNum = new Date().getFullYear();
    const years = [
        currentYearNum,
        currentYearNum - 1,
        currentYearNum - 2,
    ];

    return (
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="mb-3 flex items-center gap-2 text-gray-700">
                <Filter size={18} />
                <h3 className="font-semibold">Filter Transactions</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
                {/* Month Filter */}
                <div className="relative">
                    <select
                        value={currentMonth}
                        onChange={onMonthChange}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {months.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Year Filter */}
                <div className="relative">
                    <select
                        value={currentYear}
                        onChange={onYearChange}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={onCategoryChange}
                        className="w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">All Categories</option>
                        {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Reset Button */}
                <button
                    onClick={onReset}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    <X size={16} />
                    Reset
                </button>
            </div>
        </div>
    );
}
