"use client";

import React, { useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import AuthModal from "@/components/AuthModal";
import { useUserStore } from "@/store/useUserStore";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Terminal,
  Eye,
  Zap,
  ShieldCheck,
  Star,
  BookOpen,
  Code2,
  Layers,
  Sparkles,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [emailInput, setEmailInput] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState(false);
  const { setIsAuthModalOpen } = useUserStore();

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 flex flex-col font-sans selection:bg-[#00E699] selection:text-black">
      {/* Navigation Bar & Auth Modal */}
      <TopNav />
      <AuthModal />

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-6xl px-4 pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center text-center">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#121215] border border-[#222226] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00E699] animate-pulse"></span>
            <span className="text-xs font-mono text-zinc-300 font-medium tracking-wide">
              NOVICE TO EXTRAORDINARY — Build spine and confidence with active recall
            </span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
            Gain the <span className="text-[#00E699] emerald-text-glow font-extrabold">spine</span> and confidence to build real software.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed mb-8 font-sans">
            Spine is like freeCodeCamp and W3Schools powered by evidence-based active recall: Faded Examples, Parsons Problems, and real-time WASM sandboxes. Take your coding from beginner confusion to extraordinary mastery.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <Link
              href="/learn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#00E699] hover:bg-[#00FF9D] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,230,153,0.3)] active:scale-95"
            >
              <span>Start Interactive Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#121215] hover:bg-[#18181C] border border-[#222226] text-zinc-300 hover:text-white font-mono text-xs font-medium uppercase tracking-wider transition-colors"
            >
              Create Account 👤
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <div className="flex text-[#00E699] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#00E699]" />
              ))}
            </div>
            <span>
              Empowering <strong className="text-white">24,000+</strong> ambitious developers this month
            </span>
          </div>

          {/* HERO WORKSPACE PREVIEW CARD */}
          <div className="w-full mt-12 text-left spine-card overflow-hidden shadow-2xl border border-[#222226]">
            {/* Mockup Window Top Bar */}
            <div className="bg-[#0A0A0C] px-4 py-2.5 border-b border-[#222226] flex items-center justify-between font-mono text-xs text-zinc-400">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5 mr-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-zinc-300 font-medium px-2 py-0.5 bg-[#141418] border border-[#222226]">
                  spine/learn-workspace.py
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-[#00E699]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E699] animate-pulse"></span>
                  ACTIVE RECALL READY
                </span>
                <span className="text-zinc-500">Python 3.12 (WASM Engine)</span>
              </div>
            </div>

            {/* Split View Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#222226] bg-[#0E0E11]">
              {/* Left Column: MDX Instructional Content */}
              <div className="lg:col-span-5 p-5 md:p-6 space-y-5 bg-[#0D0D10]">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#00E699] font-bold tracking-wider uppercase">
                    PYTHON TRACK • MODULE 01
                  </span>
                  <span className="text-zinc-500">2 mins read</span>
                </div>

                <h3 className="text-xl font-extrabold text-white font-sans">
                  The Anatomy of a Loop
                </h3>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  Think of a <code className="text-[#00E699] font-mono bg-[#16161A] px-1 py-0.5">for</code> loop like an automated assembly line arm. For every item stored inside your container, it runs your instruction block once.
                </p>

                {/* Mental Model Box */}
                <div className="bg-[#141418] p-3.5 border border-[#222226] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="text-zinc-300 font-bold uppercase tracking-wider">
                      MENTAL MODEL: CONVEYOR BELT
                    </span>
                    <span className="text-[#00E699]">3/3 items pass</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                    {["Andromeda", "Orion", "Cygnus"].map((item, idx) => (
                      <React.Fragment key={item}>
                        <div
                          onClick={() => setActiveStep(idx)}
                          className={`px-2.5 py-1 text-xs font-mono cursor-pointer transition-all border ${
                            activeStep === idx
                              ? "bg-[#00E699]/10 border-[#00E699] text-[#00E699]"
                              : "bg-[#0A0A0C] border-[#222226] text-zinc-400"
                          }`}
                        >
                          🏷️ {item}
                        </div>
                        {idx < 2 && <span className="text-zinc-600 text-xs font-mono">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Verification Steps */}
                <div className="space-y-2 font-mono text-xs">
                  <span className="text-zinc-400 text-[11px] uppercase tracking-wider block font-bold">
                    VERIFICATION STEPS
                  </span>
                  <div className="space-y-1.5 text-zinc-300">
                    <div className="flex items-center gap-2 text-[#00E699]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Define list <code className="text-white">galaxy</code> with 3 items</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00E699]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Iterate using <code className="text-white">for star in galaxy</code></span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00E699]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Call <code className="text-white">illuminate(star)</code></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Code Editor Mockup */}
              <div className="lg:col-span-7 flex flex-col bg-[#0A0A0C]">
                <div className="p-5 font-mono text-xs leading-relaxed text-zinc-300 flex-1 space-y-1 select-none">
                  <div className="flex items-center text-zinc-600 text-[11px] mb-2">
                    <span className="w-8">01</span>
                    <span className="text-zinc-500"># FADED EXAMPLE: Complete loop logic</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 text-zinc-600">02</span>
                    <span>
                      <span className="text-[#00E699]">galaxy</span> = [<span className="text-amber-300">&quot;Andromeda&quot;</span>, <span className="text-amber-300">&quot;Orion&quot;</span>, <span className="text-amber-300">&quot;Cygnus&quot;</span>]
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 text-zinc-600">03</span>
                    <span></span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 text-zinc-600">04</span>
                    <span>
                      <span className="text-purple-400 font-bold">for</span> star <span className="text-purple-400 font-bold">in</span> galaxy:
                    </span>
                  </div>
                  <div className="flex items-center bg-[#00E699]/5 py-0.5 border-l-2 border-[#00E699] pl-1">
                    <span className="w-7 text-zinc-600">05</span>
                    <span className="pl-4">
                      <span className="text-blue-400">illuminate</span>(star)
                    </span>
                    <span className="ml-auto text-[10px] bg-[#00E699]/20 text-[#00E699] px-1.5 py-0.2">faded slot</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-8 text-zinc-600">06</span>
                    <span className="pl-4">
                      <span className="text-blue-400">print</span>(f<span className="text-amber-300">&quot;Illuminated: &#123;star&#125;&quot;</span>)
                    </span>
                  </div>
                </div>

                {/* Terminal Strip */}
                <div className="border-t border-[#222226] bg-[#121215] p-3">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <div className="flex items-center gap-2 text-zinc-300 font-bold">
                      <Terminal className="w-3.5 h-3.5 text-[#00E699]" />
                      <span>TERMINAL CONSOLE</span>
                      <span className="text-[#00E699] bg-[#00E699]/10 px-1.5 py-0.5 text-[10px]">
                        PASS 3/3
                      </span>
                    </div>
                    <Link
                      href="/learn"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-black bg-[#00E699] hover:bg-[#00FF9D] px-2.5 py-1 uppercase tracking-wider transition-colors"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      Run Sandbox
                    </Link>
                  </div>
                  <div className="font-mono text-[11px] text-zinc-400 space-y-1 bg-[#0A0A0C] p-2.5 border border-[#222226]">
                    <div className="text-[#00E699]">✓ [PASS] star: Andromeda illuminated</div>
                    <div className="text-[#00E699]">✓ [PASS] star: Orion illuminated</div>
                    <div className="text-[#00E699]">✓ [PASS] star: Cygnus illuminated</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 4 CORE CURRICULUM TRACKS */}
        <section id="curriculum" className="w-full max-w-6xl px-4 py-16 border-t border-[#222226]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-mono text-[#00E699] uppercase tracking-widest block mb-2 font-bold">
              COMPREHENSIVE LEARNING TRACKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              From Novice to Extraordinary
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Four structured learning tracks engineered like freeCodeCamp and W3Schools to build deep confidence step-by-step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Track 1: Python */}
            <div className="spine-card p-6 space-y-4 bg-[#121215] border-[#222226] hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#00E699] font-bold">🐍 PYTHON TRACK</span>
                <span className="text-zinc-500">WASM REPL</span>
              </div>
              <h3 className="text-xl font-bold text-white">Python Fundamentals & Automation</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Master variables, lists, for-loops, dictionaries, functions, and data manipulation with Pyodide execution directly in your browser.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#00E699] font-bold hover:underline pt-2"
              >
                <span>Launch Python Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Track 2: HTML */}
            <div className="spine-card p-6 space-y-4 bg-[#121215] border-[#222226] hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#00E699] font-bold">🌐 HTML TRACK</span>
                <span className="text-zinc-500">Live Preview</span>
              </div>
              <h3 className="text-xl font-bold text-white">Semantic Web Architecture</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Learn DOM containers, hero elements, form inputs, labels, and document flow to build structured, accessible web apps.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#00E699] font-bold hover:underline pt-2"
              >
                <span>Launch HTML Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Track 3: CSS */}
            <div className="spine-card p-6 space-y-4 bg-[#121215] border-[#222226] hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#00E699] font-bold">🎨 CSS TRACK</span>
                <span className="text-zinc-500">Flexbox & Grid</span>
              </div>
              <h3 className="text-xl font-bold text-white">Flexbox & Dark Mode Aesthetics</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Master box model padding, borders, flex alignment, CSS Grid, and responsive dark themes without intimidating math.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#00E699] font-bold hover:underline pt-2"
              >
                <span>Launch CSS Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Track 4: JavaScript */}
            <div className="spine-card p-6 space-y-4 bg-[#121215] border-[#222226] hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#00E699] font-bold">⚡ JAVASCRIPT TRACK</span>
                <span className="text-zinc-500">ES6 & DOM</span>
              </div>
              <h3 className="text-xl font-bold text-white">Interactive DOM & ES6 Functional Logic</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Wire click event listeners, transform arrays with `.map()`, handle async promises, and build dynamic frontend apps.
              </p>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 text-xs font-mono text-[#00E699] font-bold hover:underline pt-2"
              >
                <span>Launch JS Sandbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE SPINE METHODOLOGY */}
        <section id="philosophy" className="w-full max-w-6xl px-4 py-16 border-t border-[#222226]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-mono text-[#00E699] uppercase tracking-widest block mb-2 font-bold">
              THE ACTIVE RECALL ENGINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              Why Spine Works
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Three evidence-based interaction modes to prevent tutorial hell.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="spine-card p-6 space-y-4 bg-[#121215]">
              <div className="w-8 h-8 bg-[#00E699]/10 border border-[#00E699]/30 flex items-center justify-center text-[#00E699]">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">01. Faded Worked Examples</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                80% of the code structure is provided and locked. You focus entirely on filling in the critical 20% logic slot.
              </p>
            </div>

            <div className="spine-card p-6 space-y-4 bg-[#121215]">
              <div className="w-8 h-8 bg-[#00E699]/10 border border-[#00E699]/30 flex items-center justify-center text-[#00E699]">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">02. Parsons Problem Blocks</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drag-and-drop pre-written code blocks and adjust indentation levels to build correct algorithm flow without syntax typos.
              </p>
            </div>

            <div className="spine-card p-6 space-y-4 bg-[#121215]">
              <div className="w-8 h-8 bg-[#00E699]/10 border border-[#00E699]/30 flex items-center justify-center text-[#00E699]">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">03. Real-Time Sandboxes</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Client-side execution in Pyodide WASM and isolated iframe DOMs render results in under 15ms.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-[#222226] bg-[#0A0A0C] py-12 px-4 md:px-8 text-xs font-mono text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <span>© 2026 Spine Technologies Inc. All rights reserved.</span>
          <span className="text-zinc-600">From Novice to Extraordinary.</span>
        </div>
      </footer>
    </div>
  );
}
