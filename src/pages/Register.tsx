import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getAuthErrorMessage } from "../utils/authErrors";
import { Wallet } from "lucide-react";

export default function Register() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current) return;

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Les mots de passe ne correspondent pas.");
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate("/");
        } catch (err: any) {
            const message = getAuthErrorMessage(err.code);
            setError(message);
            console.error(err);
        }

        setLoading(false);
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
            {/* Brand Header */}
            <div className="mb-8 flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl">
                    <Wallet size={28} />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Finance Tracker
                </h1>
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                    <h2 className="text-center text-2xl font-bold text-gray-800">
                        Inscription
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Créez votre compte en quelques secondes
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-600 border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Adresse Email
                            </label>
                            <input
                                type="email"
                                ref={emailRef}
                                required
                                placeholder="votre@email.com"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                ref={passwordRef}
                                required
                                placeholder="• • • • • •"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Minimum 6 caractères
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Confirmer le mot de passe
                            </label>
                            <input
                                type="password"
                                ref={passwordConfirmRef}
                                required
                                placeholder="• • • • • •"
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="mt-2 w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                            type="submit"
                        >
                            {loading ? "Création du compte..." : "S'inscrire"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        Déjà un compte ?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-xs text-gray-400">
                © 2025 Finance Tracker. Tous droits réservés.
            </p>
        </div>
    );
}
