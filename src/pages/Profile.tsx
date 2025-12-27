import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Lock, Mail, User, Shield, AlertTriangle, Save } from "lucide-react";

export default function Profile() {
    const { currentUser, updateUserEmail, updateUserPassword, logout } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);

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
                setMessage("Profile updated successfully!");
                // Clear password fields for security
                if (passwordRef.current) passwordRef.current.value = "";
                if (passwordConfirmRef.current) passwordConfirmRef.current.value = "";
            })
            .catch((err) => {
                if (err.code === 'auth/requires-recent-login') {
                    setError("For security, please log in again to update this information.");
                } else {
                    setError("Error updating profile (" + err.message + ")");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors group"
                >
                    <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md mr-3 transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-3">
                    {/* Sidebar / Header Section */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white md:col-span-1 flex flex-col justify-between">
                        <div>
                            <div className="bg-white/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                                <User size={32} className="text-blue-400" />
                            </div>
                            <h2 className="text-3xl font-bold mb-2">My Account</h2>
                            <p className="text-slate-400 text-sm">Manage your personal information and security.</p>
                        </div>

                        <div className="mt-8 md:mt-0 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                            <div className="flex items-center gap-3 mb-2 text-blue-400">
                                <Shield size={18} />
                                <span className="font-semibold text-sm uppercase tracking-wider">Security</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                For your security, some actions may require a recent login.
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 md:p-12 md:col-span-2 bg-white">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                            Edit Profile
                        </h3>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
                                <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}
                        {message && (
                            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-start gap-3">
                                <Check className="shrink-0 mt-0.5" size={18} />
                                <span className="text-sm font-medium">{message}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Email Section */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        ref={emailRef}
                                        defaultValue={currentUser?.email || ""}
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="h-px bg-gray-100"></div>

                            {/* Password Section */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-4 ml-1">Change Password</label>
                                <div className="grid gap-4">
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            ref={passwordRef}
                                            placeholder="New Password"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            ref={passwordConfirmRef}
                                            placeholder="Confirm New Password"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-gray-500 ml-1">
                                    Leave blank if you do not want to change your password.
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-between gap-4">
                                <button
                                    type="button"
                                    onClick={() => logout()}
                                    className="bg-red-50 text-red-600 px-6 py-3.5 rounded-xl font-bold hover:bg-red-100 transition-colors text-sm"
                                >
                                    Log Out
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
