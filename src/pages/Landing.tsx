import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, PieChart, Shield, TrendingUp, Wallet, Layout } from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-[#16161d] font-sans text-white selection:bg-slate-700 selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#16161d]/90 backdrop-blur-md">
                <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white border border-white/5">
                            <Wallet size={18} />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-white">
                            Finance<span className="text-slate-400">Tracker</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        {currentUser ? (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="group flex items-center gap-2 text-sm font-medium text-white hover:text-slate-300 transition-colors"
                            >
                                Dashboard
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Log In
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-[#16161d] transition-all hover:bg-slate-200 active:scale-95"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32">
                <div className="container relative mx-auto px-6 text-center lg:px-12">

                    <h1 className="mx-auto max-w-4xl text-5xl font-medium tracking-tight text-white mb-8 sm:text-7xl leading-[1.1]">
                        Financial clarity for the <br />
                        <span className="text-slate-400">modern professional.</span>
                    </h1>

                    <p className="mx-auto mb-12 max-w-2xl text-lg text-slate-500 leading-relaxed font-light sm:text-xl">
                        A minimal, distration-free tool to track your income and expenses.
                        No clutter, just the insights you need to grow your wealth.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button
                            onClick={() => navigate(currentUser ? "/dashboard" : "/register")}
                            className="group flex min-w-[180px] items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-[#16161d] transition-all hover:bg-slate-200 active:scale-[0.98]"
                        >
                            {currentUser ? "Go to Dashboard" : "Start Tracking"}
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <button className="flex min-w-[180px] items-center justify-center gap-2 rounded-lg border border-white/10 px-8 py-3.5 text-base font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white active:scale-[0.98]">
                            Learn More
                        </button>
                    </div>

                    {/* Dashboard Preview - Abstract & Clean */}
                    <div className="relative mx-auto mt-24 max-w-5xl rounded-2xl border border-white/5 bg-[#1e1e26] p-2 shadow-2xl">
                        <div className="rounded-xl overflow-hidden bg-[#16161d] aspect-[16/9] flex items-center justify-center border border-white/5">
                            <div className="text-center p-8 opacity-50">
                                <Layout size={64} className="mx-auto mb-4 text-slate-600" strokeWidth={1} />
                                <p className="text-slate-600 font-mono text-sm tracking-widest uppercase">Dashboard Preview</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Features Grid */}
            <section className="py-24 border-t border-white/5 bg-[#16161d]">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid gap-12 md:grid-cols-3">
                        <div className="group">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-900/10 text-emerald-500 border border-emerald-500/10">
                                <TrendingUp size={24} />
                            </div>
                            <h3 className="mb-3 text-xl font-medium text-white">Smart Tracking</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                Log transactions instantly. We organize your financial data into clear, actionable insights.
                            </p>
                        </div>
                        <div className="group">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/10 text-blue-500 border border-blue-500/10">
                                <PieChart size={24} />
                            </div>
                            <h3 className="mb-3 text-xl font-medium text-white">Visual Analytics</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                Understand your spending habits with elegant charts that focus on what matters most.
                            </p>
                        </div>
                        <div className="group">
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-white/10">
                                <Shield size={24} />
                            </div>
                            <h3 className="mb-3 text-xl font-medium text-white">Secure & Private</h3>
                            <p className="text-slate-500 leading-relaxed font-light">
                                Your financial data is encrypted and stored securely. We prioritize your privacy above all.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="border-t border-white/5 bg-[#16161d] py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600 lg:px-12 text-sm">
                    <p>&copy; 2025 Finance Tracker.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-400 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
