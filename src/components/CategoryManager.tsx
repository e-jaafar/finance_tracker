import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import { useToast } from "../contexts/ToastContext";
import { Plus, Trash2, RotateCcw, Pencil, X, Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import type { Category } from "../types/category";

const ICON_OPTIONS = [
    "Wallet", "Briefcase", "TrendingUp", "Utensils", "Car",
    "Home", "Zap", "Film", "Heart", "ShoppingBag", "Coffee",
    "Smartphone", "Plane", "Book", "Gift", "Music", "Shield", "Star",
    "ShoppingCart", "CreditCard", "GraduationCap", "Sparkles", "PawPrint"
];

const PRESET_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b"
];

export default function CategoryManager() {
    const { categories, addCategory, updateCategory, deleteCategory, resetToDefaults, loading } = useCategories();
    const { showToast } = useToast();
    
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [resetting, setResetting] = useState(false);

    // Form State for Add/Edit
    const [formName, setFormName] = useState("");
    const [formType, setFormType] = useState<"income" | "expense" | "both">("expense");
    const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
    const [formIcon, setFormIcon] = useState("Wallet");
    const [submitting, setSubmitting] = useState(false);

    function resetForm() {
        setFormName("");
        setFormType("expense");
        setFormColor(PRESET_COLORS[0]);
        setFormIcon("Wallet");
    }

    function startEdit(cat: Category) {
        setEditingId(cat.id);
        setFormName(cat.name);
        setFormType(cat.type);
        setFormColor(cat.color);
        setFormIcon(cat.icon);
        setIsAdding(false);
    }

    function cancelEdit() {
        setEditingId(null);
        resetForm();
    }

    function startAdd() {
        setIsAdding(true);
        setEditingId(null);
        resetForm();
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!formName.trim()) return;
        
        setSubmitting(true);
        try {
            await addCategory({
                name: formName.trim(),
                type: formType,
                color: formColor,
                icon: formIcon
            });
            setIsAdding(false);
            resetForm();
            showToast("Category added successfully", "success");
        } catch (error) {
            console.error("Failed to add category", error);
            showToast("Failed to add category", "error");
        }
        setSubmitting(false);
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (!editingId || !formName.trim()) return;
        
        setSubmitting(true);
        try {
            await updateCategory(editingId, {
                name: formName.trim(),
                type: formType,
                color: formColor,
                icon: formIcon
            });
            setEditingId(null);
            resetForm();
            showToast("Category updated successfully", "success");
        } catch (error) {
            console.error("Failed to update category", error);
            showToast("Failed to update category", "error");
        }
        setSubmitting(false);
    }

    async function handleDelete(id: string) {
        try {
            await deleteCategory(id);
            showToast("Category deleted", "success");
        } catch (error) {
            console.error("Failed to delete category", error);
            showToast("Failed to delete category", "error");
        }
    }

    async function handleReset() {
        setResetting(true);
        try {
            await resetToDefaults();
            setShowResetConfirm(false);
            showToast("Categories reset to defaults", "success");
        } catch (error) {
            console.error("Failed to reset categories", error);
            showToast("Failed to reset categories", "error");
        }
        setResetting(false);
    }

    const renderIcon = (iconName: string, size = 18) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return <Icon size={size} />;
    };

    const renderForm = (isEdit: boolean) => (
        <form 
            onSubmit={isEdit ? handleUpdate : handleAdd} 
            className="bg-slate-800/50 p-4 rounded-xl border border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2"
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                    {isEdit ? "Edit Category" : "New Category"}
                </span>
                <button
                    type="button"
                    onClick={isEdit ? cancelEdit : () => setIsAdding(false)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Name</label>
                    <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        placeholder="e.g. Gym"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
                    <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as "income" | "expense" | "both")}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                        <option value="both">Both</option>
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
                            onClick={() => setFormColor(color)}
                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${formColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : ''}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                    <input
                        type="color"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
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
                            onClick={() => setFormIcon(icon)}
                            className={`p-2 rounded-lg transition-all ${formIcon === icon ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            {renderIcon(icon)}
                        </button>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={submitting || !formName.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {submitting ? (
                    "Saving..."
                ) : (
                    <>
                        <Check size={16} />
                        {isEdit ? "Update Category" : "Add Category"}
                    </>
                )}
            </button>
        </form>
    );

    if (loading) return <div className="p-4 text-center text-slate-400">Loading categories...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">My Categories</h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowResetConfirm(true)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-orange-400 transition-colors"
                        title="Reset to default categories"
                    >
                        <RotateCcw size={16} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                    <button
                        onClick={isAdding ? () => setIsAdding(false) : startAdd}
                        className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <Plus size={16} />
                        {isAdding ? "Cancel" : "Add New"}
                    </button>
                </div>
            </div>

            {/* Add Form */}
            {isAdding && !editingId && renderForm(false)}

            {/* Edit Form */}
            {editingId && renderForm(true)}

            {/* Categories Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
                {categories.map(cat => (
                    <div 
                        key={cat.id} 
                        className={`flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border transition-colors group ${
                            editingId === cat.id ? 'border-indigo-500/50' : 'border-white/5 hover:border-white/10'
                        }`}
                    >
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
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => startEdit(cat)}
                                className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                title="Edit Category"
                            >
                                <Pencil size={16} />
                            </button>
                            {!cat.isDefault && (
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete Category"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={showResetConfirm}
                onCancel={() => setShowResetConfirm(false)}
                onConfirm={handleReset}
                title="Reset Categories"
                message="This will delete all your custom categories and restore the default ones. This action cannot be undone."
                confirmLabel={resetting ? "Resetting..." : "Reset"}
                variant="warning"
            />
        </div>
    );
}
