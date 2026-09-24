"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Zap, User, Shield, LogOut } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const { xp, streak, moduleProgress, user, isAuthenticated, setIsAuthModalOpen, logout } = useUserStore();

  const isWorkspace = pathname.startsWith("/learn");
  const isAdminPage = pathname.startsWith("/admin");

  // SVG Circular progress math
  const radius = 13;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (moduleProgress / 100) * circumference;

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-[#0A0A0C]/90 backdrop-blur-md border-b border-[#222226] px-4 md:px-6 flex items-center justify-between">
      {/* Left: Branding & Main Nav */}
      <div className="flex items-center space-x-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform duration-150 active:scale-95"
        >
          {/* Stylized Spine Vertebrae Logo */}
          <div className="w-6 h-7 flex flex-col justify-between items-center py-0.5">
            <span className="w-4 h-1 bg-[#00E699] rounded-none opacity-60 group-hover:opacity-100 transition-opacity"></span>
            <span className="w-5 h-1.5 bg-[#00E699] rounded-none shadow-[0_0_8px_#00E699]"></span>
            <span className="w-5.5 h-1.5 bg-[#00E699] rounded-none"></span>
            <span className="w-4 h-1 bg-[#00E699] rounded-none opacity-80"></span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-lg tracking-tight text-white font-sans uppercase">
              Spine
            </span>
            <span className="text-[10px] font-mono font-medium text-[#00E699] bg-[#00E699]/10 px-1.5 py-0.5 border border-[#00E699]/30">
              v1.0
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        {!isWorkspace && !isAdminPage && (
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium tracking-wide text-zinc-400 font-mono">
            <a href="#philosophy" className="hover:text-white transition-colors py-1">
              Philosophy
            </a>
            <a href="#curriculum" className="hover:text-white transition-colors py-1">
              Curriculum
            </a>
            <a href="#pricing" className="hover:text-white transition-colors py-1">
              Pricing
            </a>
            <Link href="/learn" className="text-[#00E699] hover:underline font-bold py-1">
              Learn Sandbox →
            </Link>
          </nav>
        )}
      </div>

      {/* Right: Telemetry & User Auth Navigation */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Streak Counter */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121215] border border-[#222226] text-xs font-mono text-amber-400"
          title={`${streak} Day Streak`}
        >
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
          <span className="font-bold">{streak}</span>
          <span className="hidden sm:inline text-[10px] text-zinc-400 uppercase">
            Days
          </span>
        </div>

        {/* XP Counter */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121215] border border-[#222226] text-xs font-mono text-[#00E699]"
          title={`${xp} Total XP`}
        >
          <Zap className="w-3.5 h-3.5 fill-[#00E699] text-[#00E699]" />
          <span className="font-bold">{xp}</span>
          <span className="hidden sm:inline text-[10px] text-zinc-400 uppercase">
            XP
          </span>
        </div>

        {/* Module Circular Progress Ring */}
        <div
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#121215] border border-[#222226] text-xs font-mono text-zinc-300"
          title={`Module Progress: ${moduleProgress}%`}
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <svg className="w-5 h-5 transform -rotate-90">
              <circle
                cx="10"
                cy="10"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="10"
                cy="10"
                r={radius}
                className="stroke-[#00E699] transition-all duration-500 ease-out"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                fill="transparent"
              />
            </svg>
          </div>
          <span className="font-bold text-[11px] text-white">
            {moduleProgress}%
          </span>
        </div>

        {/* Admin Control Center Link (Only for admins) */}
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold hover:bg-amber-500/20 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </Link>
        )}

        {/* Auth / Account Profile Button */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 bg-[#121215] border border-[#222226] hover:border-zinc-600 text-xs font-mono text-zinc-200 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#00E699]" />
              <span className="hidden sm:inline font-bold">{user.name}</span>
            </button>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-zinc-500 hover:text-rose-400 bg-[#121215] border border-[#222226] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 bg-[#00E699] text-black hover:bg-[#00FF9D] transition-all uppercase shadow-[0_0_12px_rgba(0,230,153,0.3)]"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default TopNav;
