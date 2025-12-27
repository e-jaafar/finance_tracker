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

    const selectClassName = "w-full appearance-none rounded-xl border border-white/10 bg-background px-4 py-2.5 text-sm text-text-primary focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder-text-muted";

    return (
        <div className="rounded-2xl border border-white/5 bg-surface p-5 shadow-lg">
            <div className="mb-4 flex items-center gap-2 text-text-secondary">
                <Filter size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Filter Transactions</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {/* Month Filter */}
                <div className="relative">
                    <select
                        value={currentMonth}
                        onChange={onMonthChange}
                        className={selectClassName}
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
                        className={selectClassName}
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
                        className={selectClassName}
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
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-white/10 hover:text-white transition-all"
                >
                    <X size={16} />
                    Reset
                </button>
            </div>
        </div>
    );
}
