import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Wallet, ChevronRight } from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-[#111113] font-sans text-white">
            {/* Navbar - minimal */}
            <nav className="fixed top-0 z-50 w-full">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <Wallet size={20} className="text-emerald-400" />
                        <span className="text-sm font-medium text-white/90">FinanceTracker</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="text-sm text-white/70 hover:text-white transition-colors"
                            >
                                Dashboard
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="text-sm text-white/50 hover:text-white transition-colors"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="text-sm text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Get started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero - Clean & Direct */}
            <section className="relative pt-32 pb-8 lg:pt-40">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 text-xs text-emerald-400/80 font-medium tracking-wide uppercase">
                            <span className="w-8 h-px bg-emerald-400/50"></span>
                            Open Source
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
                            Know where your<br />
                            <span className="text-white/40">money goes.</span>
                        </h1>

                        <p className="text-lg text-white/40 max-w-lg mb-10 leading-relaxed">
                            Simple expense tracking. Set budgets, monitor spending, 
                            automate recurring payments. No complexity.
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => navigate(currentUser ? "/dashboard" : "/register")}
                                className="group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-6 py-3 rounded-lg transition-all"
                            >
                                {currentUser ? "Open Dashboard" : "Start tracking"}
                                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate("/login")}
                                className="text-white/50 hover:text-white text-sm transition-colors"
                            >
                                I have an account
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Preview */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="relative rounded-xl border border-white/[0.08] bg-white/[0.02] p-1.5 max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111113] z-10 pointer-events-none rounded-xl"></div>
                        <img 
                            src="https://i.ibb.co/4RRGJsTd/Capture-d-e-cran-2025-12-30-a-01-19-50.png" 
                            alt="Dashboard"
                            className="rounded-lg w-full"
                        />
                    </div>
                </div>
            </section>

            {/* Features - Minimal list */}
            <section className="py-20 border-t border-white/[0.05]">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Built for clarity.
                            </h2>
                            <p className="text-white/40 leading-relaxed">
                                No bloated features. Just the essentials to understand 
                                your finances and make better decisions.
                            </p>
                        </div>

                        <div className="space-y-0">
                            {[
                                { title: "Expense Tracking", desc: "Log transactions with categories" },
                                { title: "Budget Goals", desc: "Set limits, track progress" },
                                { title: "Visual Reports", desc: "Charts that make sense" },
                                { title: "Recurring Payments", desc: "Automate regular expenses" },
                            ].map((feature, i) => (
                                <div 
                                    key={i} 
                                    className="flex items-center justify-between py-5 border-b border-white/[0.05] group"
                                >
                                    <div>
                                        <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                                        <p className="text-sm text-white/30">{feature.desc}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA - Simple */}
            <section className="py-24 border-t border-white/[0.05]">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-white/30 text-sm mb-4">Free forever. Your data stays private.</p>
                    <h2 className="text-3xl font-semibold text-white mb-8">
                        Ready to start?
                    </h2>
                    <button
                        onClick={() => navigate(currentUser ? "/dashboard" : "/register")}
                        className="group inline-flex items-center gap-2 bg-white text-black font-medium px-8 py-4 rounded-lg hover:bg-white/90 transition-all"
                    >
                        {currentUser ? "Go to Dashboard" : "Create free account"}
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </section>

            {/* Footer - Minimal */}
            <footer className="py-8 border-t border-white/[0.05]">
                <div className="container mx-auto px-6 flex items-center justify-between text-xs text-white/30">
                    <span>FinanceTracker</span>
                    <span>&copy; {new Date().getFullYear()}</span>
                </div>
            </footer>
        </div>
    );
}
