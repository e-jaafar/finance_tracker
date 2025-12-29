import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, AlertCircle, Check, ArrowLeft, Shield, Tag } from "lucide-react";
import CategoryManager from "../components/CategoryManager";
import { getAuthErrorMessage } from "../utils/authErrors";

export default function Profile() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const { currentUser, updateUserEmail, updateUserPassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            return setError("Passwords do not match");
        }

        const promises = [];
        setLoading(true);
        setError("");
        setMessage("");

        if (emailRef.current?.value && emailRef.current.value !== currentUser?.email) {
            promises.push(updateUserEmail(emailRef.current.value));
        }
        if (passwordRef.current?.value) {
            promises.push(updateUserPassword(passwordRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                setMessage("Profile updated successfully");
            })
            .catch((err) => {
                setError(getAuthErrorMessage(err.code));
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
                            onClick={() => navigate("/")}
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
                            <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-[#1e1e26] p-8 shadow-2xl">

                        {error && (
                            <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-200 animate-in slide-in-from-top-2">
                                <AlertCircle size={18} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-200 animate-in slide-in-from-top-2">
                                <Check size={18} className="shrink-0" />
                                {message}
                            </div>
                        )}

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
                                        />
                                        <Lock className={iconClassName} size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                    <Tag size={16} className="text-slate-400" />
                                    Category Management
                                </h3>
                                <CategoryManager />
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
                </div>
            </main>
        </div>
    );
}
