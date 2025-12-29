import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { Plus, Trash2 } from "lucide-react";
import * as LucideIcons from "lucide-react";

const ICON_OPTIONS = [
    "Wallet", "Briefcase", "TrendingUp", "Utensils", "Car",
    "Home", "Zap", "Film", "Heart", "ShoppingBag", "Coffee",
    "Smartphone", "Plane", "Book", "Gift", "Music", "Shield", "Star"
];

const PRESET_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"
];

export default function CategoryManager() {
    const { categories, addCategory, deleteCategory, loading } = useCategories();
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState<"income" | "expense">("expense");
    const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
    const [newIcon, setNewIcon] = useState("Wallet");
    const [submitting, setSubmitting] = useState(false);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!newName) return;
        setSubmitting(true);
        try {
            await addCategory({
                name: newName,
                type: newType,
                color: newColor,
                icon: newIcon
            });
            setIsAdding(false);
            setNewName("");
            setNewColor(PRESET_COLORS[0]);
            setNewIcon("Wallet");
        } catch (error) {
            console.error("Failed to add category", error);
        }
        setSubmitting(false);
    }

    const renderIcon = (iconName: string, size = 18) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return <Icon size={size} />;
    };

    if (loading) return <div className="p-4 text-center text-slate-400">Loading categories...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">My Categories</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    <Plus size={16} />
                    {isAdding ? "Cancel" : "Add New"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleAdd} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                placeholder="e.g. Gym"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                            <select
                                value={newType}
                                onChange={(e) => setNewType(e.target.value as any)}
                                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setNewColor(color)}
                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${newColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : ''}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <input
                                type="color"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                className="w-6 h-6 rounded-full bg-transparent border-none p-0 cursor-pointer overflow-hidden"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Icon</label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                            {ICON_OPTIONS.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setNewIcon(icon)}
                                    className={`p-2 rounded-lg transition-all ${newIcon === icon ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                >
                                    {renderIcon(icon)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors text-sm disabled:opacity-50"
                    >
                        {submitting ? "Saving..." : "Save Category"}
                    </button>
                </form>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                {categories.map(cat => (
                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-white/5 hover:border-white/10 transition-colors group">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
                                style={{ backgroundColor: cat.color }}
                            >
                                {renderIcon(cat.icon)}
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm">{cat.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{cat.type}</p>
                            </div>
                        </div>
                        {!cat.isDefault && (
                            <button
                                onClick={() => deleteCategory(cat.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Category"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
