import { useRef, useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCurrency, CURRENCIES } from "../contexts/CurrencyContext";
import { useToast } from "../contexts/ToastContext";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Lock, ArrowLeft, Shield, Tag, Coins, AlertTriangle, UserPlus } from "lucide-react";
import CategoryManager from "../components/CategoryManager";
import { getAuthErrorMessage } from "../utils/authErrors";

export default function Profile() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const linkEmailRef = useRef<HTMLInputElement>(null);
    const linkPasswordRef = useRef<HTMLInputElement>(null);
    const linkPasswordConfirmRef = useRef<HTMLInputElement>(null);
    const categorySectionRef = useRef<HTMLDivElement>(null);
    const { currentUser, updateUserEmail, updateUserPassword, isGuest, linkGuestAccount } = useAuth();
    const { currency, setCurrency } = useCurrency();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [linkingAccount, setLinkingAccount] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to categories section if hash is #categories
    useEffect(() => {
        if (location.hash === "#categories" && categorySectionRef.current) {
            setTimeout(() => {
                categorySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, [location.hash]);

    async function handleCurrencyChange(newCurrency: string) {
        try {
            await setCurrency(newCurrency as any);
            showToast(`Currency changed to ${newCurrency}`, "success");
        } catch {
            showToast("Failed to change currency", "error");
        }
    }

    async function handleLinkAccount(e: React.FormEvent) {
        e.preventDefault();
        
        if (!linkEmailRef.current?.value || !linkPasswordRef.current?.value) {
            showToast("Please fill in all fields", "error");
            return;
        }
        
        if (linkPasswordRef.current.value !== linkPasswordConfirmRef.current?.value) {
            showToast("Passwords do not match", "error");
            return;
        }

        if (linkPasswordRef.current.value.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }

        try {
            setLinkingAccount(true);
            await linkGuestAccount(linkEmailRef.current.value, linkPasswordRef.current.value);
            showToast("Account created successfully! Your data has been saved.", "success");
        } catch (err: any) {
            showToast(getAuthErrorMessage(err.code), "error");
        } finally {
            setLinkingAccount(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            showToast("Passwords do not match", "error");
            return;
        }

        const promises = [];
        setLoading(true);

        if (emailRef.current?.value && emailRef.current.value !== currentUser?.email) {
            promises.push(updateUserEmail(emailRef.current.value));
        }
        if (passwordRef.current?.value) {
            promises.push(updateUserPassword(passwordRef.current.value));
        }

        if (promises.length === 0) {
            showToast("No changes to save", "info");
            setLoading(false);
            return;
        }

        Promise.all(promises)
            .then(() => {
                showToast("Profile updated successfully", "success");
                // Clear password fields after successful update
                if (passwordRef.current) passwordRef.current.value = "";
                if (passwordConfirmRef.current) passwordConfirmRef.current.value = "";
            })
            .catch((err) => {
                showToast(getAuthErrorMessage(err.code), "error");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const inputClassName = "w-full rounded-lg border border-white/10 bg-[#16161d] px-4 py-3 pl-11 text-white outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all placeholder-slate-600";
    const labelClassName = "mb-2 block text-xs font-semibold text-slate-400 uppercase tracking-wider";
    const iconClassName = "absolute left-4 top-[3rem] text-slate-500";

    return (
        <div className="min-h-screen bg-[#16161d] pb-20 font-sans text-white selection:bg-slate-700 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-30 border-b border-white/5 bg-[#16161d]/90 backdrop-blur-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="group mr-4 flex items-center gap-2 rounded-lg py-2 pr-4 text-sm font-medium text-slate-400 transition-colors hover:text-white"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="mx-auto max-w-2xl">

                    <div className="mb-8 flex items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-white/5">
                            <User size={30} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-medium text-white tracking-tight">Profile Settings</h1>
                            <p className="text-slate-500 mt-1">
                                {isGuest ? "You're using a guest account" : "Manage your account preferences and security."}
                            </p>
                        </div>
                    </div>

                    {/* Guest Account Banner */}
                    {isGuest && (
                        <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h3 className="font-semibold text-amber-200">Guest Account</h3>
                                    <p className="text-sm text-amber-200/70 mt-1">
                                        Your data is saved but will be lost if you clear your browser data or sign out. 
                                        Create an account below to keep your data permanently.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create Account Form for Guests */}
                    {isGuest && (
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 shadow-2xl mb-8">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <UserPlus size={20} className="text-emerald-400" />
                                Create Your Account
                            </h3>
                            <p className="text-slate-400 text-sm mb-6">
                                Save your data permanently by creating an account. All your transactions and settings will be preserved.
                            </p>

                            <form onSubmit={handleLinkAccount} className="space-y-5">
                                <div className="relative">
                                    <label className={labelClassName}>Email Address</label>
                                    <input
                                        type="email"
                                        ref={linkEmailRef}
                                        required
                                        className={inputClassName}
                                        placeholder="your@email.com"
                                        autoComplete="email"
                                    />
                                    <Mail className={iconClassName} size={18} />
                                </div>

                                <div className="relative">
                                    <label className={labelClassName}>Password</label>
                                    <input
                                        type="password"
                                        ref={linkPasswordRef}
                                        required
                                        minLength={6}
                                        className={inputClassName}
                                        placeholder="Min. 6 characters"
                                        autoComplete="new-password"
                                    />
                                    <Lock className={iconClassName} size={18} />
                                </div>

                                <div className="relative">
                                    <label className={labelClassName}>Confirm Password</label>
                                    <input
                                        type="password"
                                        ref={linkPasswordConfirmRef}
                                        required
                                        minLength={6}
                                        className={inputClassName}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                    />
                                    <Lock className={iconClassName} size={18} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={linkingAccount}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                >
                                    {linkingAccount ? "Creating Account..." : "Create Account & Save Data"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Regular Profile Settings (only for non-guests) */}
                    {!isGuest && (
                        <div className="rounded-2xl border border-white/5 bg-[#1e1e26] p-8 shadow-2xl">

                            <form onSubmit={handleSubmit} className="space-y-8">

                                <div className="relative">
                                    <label className={labelClassName}>Email Address</label>
                                    <input
                                        type="email"
                                        ref={emailRef}
                                        required
                                        defaultValue={currentUser?.email || ""}
                                        className={inputClassName}
                                        placeholder="your@email.com"
                                        autoComplete="email"
                                    />
                                    <Mail className={iconClassName} size={18} />
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                        <Shield size={16} className="text-slate-400" />
                                        Security
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <label className={labelClassName}>New Password</label>
                                            <input
                                                type="password"
                                                ref={passwordRef}
                                                className={inputClassName}
                                                placeholder="Leave blank to keep current"
                                                autoComplete="new-password"
                                            />
                                            <Lock className={iconClassName} size={18} />
                                        </div>

                                        <div className="relative">
                                            <label className={labelClassName}>Confirm New Password</label>
                                            <input
                                                type="password"
                                                ref={passwordConfirmRef}
                                                className={inputClassName}
                                                placeholder="Leave blank to keep current"
                                                autoComplete="new-password"
                                            />
                                            <Lock className={iconClassName} size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                        <Coins size={16} className="text-slate-400" />
                                        Currency Preferences
                                    </h3>
                                    <div className="relative">
                                        <label className={labelClassName}>Display Currency</label>
                                        <select
                                            value={currency}
                                            onChange={(e) => handleCurrencyChange(e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#16161d] px-4 py-3 text-white outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all appearance-none cursor-pointer"
                                        >
                                            {Object.entries(CURRENCIES).map(([code, info]) => (
                                                <option key={code} value={code}>
                                                    {info.symbol} - {info.name} ({code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3.5 font-bold text-[#16161d] shadow-lg shadow-white/5 transition-all hover:bg-slate-200 hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                    >
                                        {loading ? "Updating Profile..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Currency for guests - separate section */}
                    {isGuest && (
                        <div className="rounded-2xl border border-white/5 bg-[#1e1e26] p-8 shadow-2xl mb-8">
                            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                <Coins size={16} className="text-slate-400" />
                                Currency Preferences
                            </h3>
                            <div className="relative">
                                <label className={labelClassName}>Display Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => handleCurrencyChange(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-[#16161d] px-4 py-3 text-white outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all appearance-none cursor-pointer"
                                >
                                    {Object.entries(CURRENCIES).map(([code, info]) => (
                                        <option key={code} value={code}>
                                            {info.symbol} - {info.name} ({code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Category Management - Outside the form */}
                    <div ref={categorySectionRef} id="categories" className="mt-8 rounded-2xl border border-white/5 bg-[#1e1e26] p-8 shadow-2xl scroll-mt-24">
                        <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                            <Tag size={16} className="text-slate-400" />
                            Category Management
                        </h3>
                        <CategoryManager />
                    </div>
                </div>
            </main>
        </div>
    );
}
