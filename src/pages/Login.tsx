import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ChevronRight, Wallet, User } from "lucide-react";
import { getAuthErrorMessage } from "../utils/authErrors";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { login, signInWithGoogle, signInAsGuest } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleGoogleSignIn() {
        try {
            setError("");
            setLoading(true);
            await signInWithGoogle();
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(getAuthErrorMessage(err));
        }
        setLoading(false);
    }

    async function handleGuestSignIn() {
        try {
            setError("");
            setLoading(true);
            await signInAsGuest();
            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(getAuthErrorMessage(err));
        }
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!emailRef.current || !passwordRef.current) return;

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate("/dashboard");
        } catch (err: any) {
            setError(getAuthErrorMessage(err.code));
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-[#16161d] flex items-center justify-center p-4 selection:bg-slate-700 selection:text-white font-sans text-white">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                {/* Brand Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-white border border-white/5 mb-6">
                        <Wallet size={24} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mt-2 text-sm">Log in to manage your finances</p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#1e1e26] p-8 shadow-2xl">

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-lg flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-2 ml-1 uppercase tracking-wider">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="email"
                                    ref={emailRef}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-[#16161d] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition-all font-medium text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs text-slate-500 hover:text-slate-300 hover:underline">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                                <input
                                    type="password"
                                    ref={passwordRef}
                                    required
                                    className="w-full pl-11 pr-4 py-3 bg-[#16161d] border border-white/10 rounded-lg text-white placeholder-slate-600 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none transition-all font-medium text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-white hover:bg-slate-200 text-[#16161d] font-bold py-3.5 rounded-lg shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-4 active:scale-[0.98]"
                        >
                            {loading ? "Logging in..." : "Log In"}
                            {!loading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/5" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#1e1e26] px-2 text-slate-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-[#16161d] hover:bg-slate-800 text-white font-medium py-3.5 rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            onClick={handleGuestSignIn}
                            disabled={loading}
                            className="w-full bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white font-medium py-3.5 rounded-lg border border-white/5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <User size={18} />
                            Continue as Guest
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-white hover:text-slate-300 hover:underline transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
