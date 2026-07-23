"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FacultyLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/faculty/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("faculty_email", data.email);
        router.push("/faculty/dashboard");
      } else {
        setError(data.detail || "Login failed");
      }
    } catch {
      setError("Could not reach server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #e8eaf6 50%, #f3e5f5 100%)" }}>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-on-surface tracking-tighter">Pathwise</h1>
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-tertiary-container/30 rounded-full border border-tertiary/20">
            <span className="material-symbols-outlined text-tertiary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            <span className="text-xs font-bold text-tertiary uppercase tracking-widest">Faculty Portal</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-bordermist rounded-xl p-xl shadow-none">
          <h2 className="text-xl font-bold text-on-surface">Faculty Sign In</h2>
          <p className="text-sm text-on-surface-variant mt-1 mb-6">Enter your faculty credentials to access the instructor dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant" htmlFor="fac-email">Email</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">mail</span>
                <input
                  id="fac-email"
                  type="email"
                  placeholder="faculty@pathwise.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-on-surface-variant" htmlFor="fac-pass">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input
                  id="fac-pass"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full h-12 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-4 border-t border-outline-variant text-center">
            <p className="text-xs text-on-surface-variant">
              Default: <strong>faculty@pathwise.edu</strong> / <strong>faculty123</strong>
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
