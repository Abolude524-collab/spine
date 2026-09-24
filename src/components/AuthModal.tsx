"use client";

import React, { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { X, User, Lock, Shield, Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register, user } = useUserStore();
  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (mode === "login") {
      const res = await login(email);
      setLoading(false);
      if (res.success) {
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => setIsAuthModalOpen(false), 800);
      } else {
        setErrorMsg(res.error || "Failed to log in.");
      }
    } else {
      const res = await register(name, email, role);
      setLoading(false);
      if (res.success) {
        setSuccessMsg(`Welcome to Spine, ${name}!`);
        setTimeout(() => setIsAuthModalOpen(false), 800);
      } else {
        setErrorMsg(res.error || "Failed to create account.");
      }
    }
  };

  const handleQuickSwitch = async (quickEmail: string) => {
    setLoading(true);
    setErrorMsg(null);
    const res = await login(quickEmail);
    setLoading(false);
    if (res.success) {
      setSuccessMsg(`Switched session to ${quickEmail}`);
      setTimeout(() => setIsAuthModalOpen(false), 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 font-sans select-none animate-fadeIn">
      <div className="w-full max-w-md bg-[#0D0D10] border border-[#222226] shadow-2xl p-6 relative rounded-none space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00E699] rounded-full animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-[#00E699] uppercase tracking-wider">
              Spine Account Portal
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {mode === "login" ? "Welcome Back to Spine" : "Create Your Spine Account"}
          </h2>
          <p className="text-xs text-zinc-400">
            {mode === "login"
              ? "Access your learning telemetry, track progress, and build spine."
              : "Start building confidence from novice to extraordinary."}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#141418] border border-[#222226] font-mono text-xs font-bold">
          <button
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`py-2 text-center transition-all ${
              mode === "login"
                ? "bg-[#00E699] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`py-2 text-center transition-all ${
              mode === "register"
                ? "bg-[#00E699] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-[#00E699]/10 border border-[#00E699]/40 text-[#00E699] text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00E699]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Enoch Abolude"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0C] border border-[#222226] text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E699]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="e.g. learner@spine.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0C] border border-[#222226] text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E699]"
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                Account Role
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`p-2.5 border text-left flex items-center justify-between transition-all ${
                    role === "student"
                      ? "border-[#00E699] bg-[#00E699]/10 text-[#00E699]"
                      : "border-[#222226] bg-[#0A0A0C] text-zinc-400"
                  }`}
                >
                  <span>Student Learner</span>
                  {role === "student" && <Sparkles className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`p-2.5 border text-left flex items-center justify-between transition-all ${
                    role === "admin"
                      ? "border-[#00E699] bg-[#00E699]/10 text-[#00E699]"
                      : "border-[#222226] bg-[#0A0A0C] text-zinc-400"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-400" /> Admin Lead
                  </span>
                  {role === "admin" && <Sparkles className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00E699] hover:bg-[#00FF9D] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,230,153,0.3)] disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : mode === "login"
              ? "Authenticate Session"
              : "Create Account & Start Learning"}
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="pt-3 border-t border-[#222226] space-y-2 font-mono text-xs">
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider block font-bold">
            QUICK DEMO SESSION SWITCHER:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickSwitch("admin@spine.dev")}
              className="p-2 bg-[#141418] border border-[#222226] hover:border-[#00E699] text-left transition-colors"
            >
              <div className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                <Shield className="w-3 h-3" /> Admin Account
              </div>
              <div className="text-[10px] text-zinc-400">admin@spine.dev</div>
            </button>

            <button
              onClick={() => handleQuickSwitch("enoch@example.com")}
              className="p-2 bg-[#141418] border border-[#222226] hover:border-[#00E699] text-left transition-colors"
            >
              <div className="text-[#00E699] font-bold text-[11px]">Student Learner</div>
              <div className="text-[10px] text-zinc-400">enoch@example.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
