import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, CreditCard, ChevronRight } from "lucide-react";
import { getAuthErrorMessage } from "../utils/authErrors";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!emailRef.current || !passwordRef.current) return;

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (err: any) {
            // Use our utility to translate error
            setError(getAuthErrorMessage(err.code));
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Brand Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-2xl bg-blue-600 text-white shadow-lg mb-4">
                        <CreditCard size={40} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">Finance Tracker</h1>
                    <p className="text-blue-600/80 mt-2 font-medium">Welcome back!</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-white/50 backdrop-blur-sm">
                    <div className="p-8 sm:p-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            Log in to manage your finances
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        ref={emailRef}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        ref={passwordRef}
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                {loading ? "Logging in..." : "Log In"}
                                {!loading && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-50 px-8 py-6 text-center border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            No account yet?{" "}
                            <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-blue-900/40 text-sm mt-8">
                    © 2025 Finance Tracker. All rights reserved.
                </p>
            </div>
        </div>
    );
}
