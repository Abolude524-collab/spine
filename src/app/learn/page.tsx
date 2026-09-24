"use client";

import React, { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import AuthModal from "@/components/AuthModal";
import { useUserStore } from "@/store/useUserStore";
import { useLessonStore } from "@/store/useLessonStore";
import SpineMonacoEditor from "@/components/MonacoEditor";
import ParsonsEngine from "@/components/ParsonsEngine";
import VisualSandbox from "@/components/VisualSandbox";
import { runPythonCode } from "@/lib/pyodideRunner";
import { runLessonAssertions } from "@/lib/testRunner";
import { TRACKS as SEED_TRACKS, Track, Lesson } from "@/data/curriculumData";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Layers,
  HelpCircle,
  ListTree,
  Lock,
  Eye,
  BookOpen,
  ChevronDown,
  Menu,
  Sparkles,
} from "lucide-react";

export default function LearnWorkspace() {
  const { addXp, moduleProgress, setModuleProgress, user } = useUserStore();
  const {
    challengeType,
    setChallengeType,
    fadedCode,
    setFadedCode,
    lockedLines,
    resetLesson,
    loadLesson,
  } = useLessonStore();

  // Dynamic Live Database Curriculum State
  const [liveTracks, setLiveTracks] = useState<Record<string, Track>>(SEED_TRACKS);
  const [loadingCurriculum, setLoadingCurriculum] = useState(true);

  // Active Track, Module, and Lesson Indexes
  const [selectedTrackId, setSelectedTrackId] = useState<"python" | "html" | "css" | "javascript">("python");
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const [isTrackDropdownOpen, setIsTrackDropdownOpen] = useState(false);
  const [isLessonDrawerOpen, setIsLessonDrawerOpen] = useState(false);

  // Fetch Live Curriculum from Database API on mount
  const fetchLiveCurriculumFromDB = async () => {
    try {
      const res = await fetch("/api/curriculum");
      const data = await res.json();
      if (data.success && data.tracks) {
        setLiveTracks(data.tracks);
      }
    } catch (err) {
      console.warn("Using fallback seed curriculum", err);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  useEffect(() => {
    fetchLiveCurriculumFromDB();
  }, []);

  const activeTrack: Track = liveTracks[selectedTrackId] || liveTracks.python || SEED_TRACKS.python;
  const activeModule = activeTrack?.modules?.[activeModuleIndex] || activeTrack?.modules?.[0] || SEED_TRACKS.python.modules[0];
  const activeLesson: Lesson = activeModule?.lessons?.[activeLessonIndex] || activeModule?.lessons?.[0] || SEED_TRACKS.python.modules[0].lessons[0];

  const [activeEngineMode, setActiveEngineMode] = useState<"ide" | "parsons" | "visual">("ide");

  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    `> Live DB Curriculum Engine loaded`,
    `✓ Student Session: ${user?.name || "Learner"} (${user?.role || "student"})`,
    `✓ Active Track: ${activeTrack.title}`,
    `✓ Active Lesson: ${activeLesson.title}`,
  ]);

  const [verificationSteps, setVerificationSteps] = useState<
    { id: number; text: string; completed?: boolean }[]
  >(activeLesson.verificationSteps.map((s) => ({ ...s, completed: false })));

  const [isRunning, setIsRunning] = useState(false);
  const [activeTapeIndex, setActiveTapeIndex] = useState<number>(0);

  // Synchronize active lesson state with store whenever track or indexes change
  useEffect(() => {
    if (activeLesson) {
      loadLesson(activeLesson);
      setVerificationSteps(activeLesson.verificationSteps.map((s) => ({ ...s, completed: false })));
      setTerminalOutput([
        `> Live Database Track: ${activeTrack.badge} • ${activeTrack.title}`,
        `✓ ${activeModule.title}`,
        `✓ Active Lesson: ${activeLesson.title}`,
      ]);
    }
  }, [selectedTrackId, activeModuleIndex, activeLessonIndex, liveTracks]);

  const handleTrackChange = (trackId: "python" | "html" | "css" | "javascript") => {
    setSelectedTrackId(trackId);
    setActiveModuleIndex(0);
    setActiveLessonIndex(0);
    setIsTrackDropdownOpen(false);

    if (trackId === "html" || trackId === "css") {
      setActiveEngineMode("visual");
    } else {
      setActiveEngineMode("ide");
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < activeModule.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else if (activeModuleIndex < activeTrack.modules.length - 1) {
      setActiveModuleIndex(activeModuleIndex + 1);
      setActiveLessonIndex(0);
    } else {
      setTerminalOutput((prev) => [
        ...prev,
        "🎉 Track Completed! Choose another track or check back for new admin published modules.",
      ]);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    } else if (activeModuleIndex > 0) {
      const prevModIndex = activeModuleIndex - 1;
      setActiveModuleIndex(prevModIndex);
      setActiveLessonIndex(activeTrack.modules[prevModIndex].lessons.length - 1);
    }
  };

  const handleRunSandbox = async () => {
    setIsRunning(true);
    setTerminalOutput([`> Executing ${activeTrack.title} challenge against DB specifications...`]);

    if (selectedTrackId === "python") {
      const result = await runPythonCode(fadedCode);
      setIsRunning(false);
      const assertions = runLessonAssertions(fadedCode);

      setVerificationSteps((prev) =>
        prev.map((step) => {
          const found = assertions.results.find((r) => r.stepId === step.id);
          return found ? { ...step, completed: found.passed } : { ...step, completed: true };
        })
      );

      if (result.success) {
        addXp(25);
        if (moduleProgress < 100) {
          setModuleProgress(Math.min(100, moduleProgress + 15));
        }

        // Sync with backend API
        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            xpDelta: 25,
            lessonId: activeLesson.id,
            moduleId: activeModule.id,
          }),
        }).catch((e) => console.warn("Progress sync error", e));

        setTerminalOutput([
          `> Pyodide WASM execution completed in ${result.executionTimeMs}ms`,
          ...result.output,
          "✨ +25 XP Earned! Synced to database profile.",
        ]);
      } else {
        setTerminalOutput([
          `> Pyodide execution finished in ${result.executionTimeMs}ms`,
          ...result.output,
        ]);
      }
    } else {
      setTimeout(() => {
        setIsRunning(false);
        addXp(25);
        setVerificationSteps((prev) => prev.map((s) => ({ ...s, completed: true })));
        if (moduleProgress < 100) {
          setModuleProgress(Math.min(100, moduleProgress + 15));
        }

        fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            xpDelta: 25,
            lessonId: activeLesson.id,
            moduleId: activeModule.id,
          }),
        }).catch((e) => console.warn("Progress sync error", e));

        setTerminalOutput([
          `> ${activeTrack.title} visual sandbox rendered from database`,
          "✓ [PASS] Active recall verification passed",
          "✨ +25 XP Earned & Synced!",
        ]);
      }, 300);
    }
  };

  const handleConsoleLogFromVisual = (logMessage: string) => {
    setTerminalOutput((prev) => [...prev, logMessage]);
  };

  return (
    <div className="h-screen w-screen bg-[#0A0A0C] text-zinc-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Top Header & Auth Portal */}
      <TopNav />
      <AuthModal />

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#222226] overflow-hidden">
        
        {/* LEFT PANEL: MDX Instructional & Mental Model Panel (5 cols) */}
        <div className="md:col-span-5 flex flex-col bg-[#0D0D10] overflow-y-auto">
          
          {/* Track & Module Selector Bar */}
          <div className="p-4 border-b border-[#222226] flex items-center justify-between font-mono text-xs bg-[#0A0A0C] relative">
            {/* Track Selector Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsTrackDropdownOpen(!isTrackDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 bg-[#121215] border border-[#00E699]/40 text-[#00E699] font-bold uppercase tracking-wider hover:border-[#00E699] transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{activeTrack.badge}</span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {isTrackDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-[#121215] border border-[#222226] shadow-xl z-50 py-1 font-mono text-xs">
                    <div className="px-3 py-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wider border-b border-[#222226] flex justify-between items-center">
                      <span>Live Database Tracks</span>
                      <Sparkles className="w-3 h-3 text-[#00E699]" />
                    </div>
                    {Object.values(liveTracks).map((track) => (
                      <button
                        key={track.id}
                        onClick={() => handleTrackChange(track.id as any)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#18181C] transition-colors ${
                          selectedTrackId === track.id
                            ? "text-[#00E699] font-bold bg-[#00E699]/5"
                            : "text-zinc-300"
                        }`}
                      >
                        <span>{track.badge}</span>
                        {selectedTrackId === track.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E699]"></span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Lesson Drawer Directory Toggle */}
              <button
                onClick={() => setIsLessonDrawerOpen(!isLessonDrawerOpen)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#121215] border border-[#222226] text-zinc-400 hover:text-white transition-colors"
                title="View All Lessons"
              >
                <Menu className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Directory</span>
              </button>
            </div>

            <span className="text-zinc-500 font-mono text-[11px]">
              {activeLesson.readTime}
            </span>
          </div>

          {/* Lesson Drawer Directory Overlay */}
          {isLessonDrawerOpen && (
            <div className="p-4 bg-[#121215] border-b border-[#222226] font-mono text-xs space-y-3">
              <div className="flex items-center justify-between text-[#00E699] font-bold uppercase text-[11px]">
                <span>{activeTrack.title} Live DB Directory</span>
                <button onClick={() => setIsLessonDrawerOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {activeTrack.modules?.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-1">
                    <div className="text-[10px] text-zinc-400 font-bold uppercase">{mod.title}</div>
                    {mod.lessons?.map((les, lIdx) => (
                      <button
                        key={les.id}
                        onClick={() => {
                          setActiveModuleIndex(mIdx);
                          setActiveLessonIndex(lIdx);
                          setIsLessonDrawerOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between transition-colors ${
                          activeModuleIndex === mIdx && activeLessonIndex === lIdx
                            ? "bg-[#00E699]/15 text-[#00E699] font-bold border-l-2 border-[#00E699]"
                            : "bg-[#0A0A0C] text-zinc-300 hover:bg-[#18181C]"
                        }`}
                      >
                        <span>{les.title}</span>
                        <span className="text-[10px] text-zinc-500">{les.readTime}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Content Area */}
          <div className="p-6 flex-1 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                {activeModule.title}
              </span>
              <h1 className="text-2xl font-extrabold text-white mb-2 font-sans">
                {activeLesson.title}
              </h1>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {activeLesson.instructionalText}
              </p>
            </div>

            {/* Mental Model Visualization Box */}
            <div className="spine-card p-4 space-y-3 bg-[#121215]">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00E699]" />
                  {activeLesson.mentalModelTitle}
                </span>
                <span className="text-[#00E699] text-[11px] font-bold">Active Concept</span>
              </div>

              <p className="text-[11px] text-zinc-400 font-sans">
                {activeLesson.mentalModelDescription}
              </p>

              <div className="flex items-center gap-2 pt-1 overflow-x-auto">
                {activeLesson.mentalModelItems.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => setActiveTapeIndex(idx)}
                      className={`px-3 py-1.5 text-xs font-mono transition-all border ${
                        activeTapeIndex === idx
                          ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699] shadow-[0_0_10px_rgba(0,230,153,0.2)]"
                          : "bg-[#0A0A0C] border-[#222226] text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      🏷️ {item}
                    </button>
                    {idx < activeLesson.mentalModelItems.length - 1 && (
                      <span className="text-zinc-600 font-mono text-xs">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                VERIFICATION STEPS
              </span>
              <div className="space-y-2 font-mono text-xs">
                {verificationSteps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-start gap-2.5 p-2.5 border transition-all ${
                      step.completed
                        ? "bg-[#00E699]/5 border-[#00E699]/40 text-[#00E699]"
                        : "bg-[#121215] border-[#222226] text-zinc-400"
                    }`}
                  >
                    <div className="pt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00E699]" />
                      ) : (
                        <div className="w-4 h-4 rounded-none border border-zinc-600"></div>
                      )}
                    </div>
                    <span className="flex-1 leading-snug">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plain English Explainer */}
            <div className="bg-[#121216] p-3.5 border-l-2 border-[#00E699] text-xs font-sans text-zinc-300 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00E699] font-mono text-[11px] font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                PLAIN-ENGLISH EXPLAINER
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Pulled directly from the live database. Edit code in the workspace and run the sandbox to test logic.
              </p>
            </div>
          </div>

          {/* Action Navigation Footer */}
          <div className="p-4 border-t border-[#222226] bg-[#0A0A0C] flex items-center justify-between">
            <button
              onClick={handlePrevLesson}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#121215] border border-[#222226] text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={handleRunSandbox}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00E699] hover:bg-[#00FF9D] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,230,153,0.25)] active:scale-95 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              {isRunning ? "Running..." : "Run Sandbox"}
            </button>

            <button
              onClick={handleNextLesson}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#121215] border border-[#222226] text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic Interactive Engine (7 cols) */}
        <div className="md:col-span-7 flex flex-col bg-[#0A0A0C] overflow-hidden">
          {/* Engine Mode Switcher Tabs */}
          <div className="bg-[#0A0A0C] px-4 py-2 border-b border-[#222226] flex items-center justify-between font-mono text-xs overflow-x-auto">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setActiveEngineMode("ide");
                  setChallengeType("faded_example");
                }}
                className={`px-3 py-1 border flex items-center gap-1.5 transition-all text-xs font-bold ${
                  activeEngineMode === "ide"
                    ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699]"
                    : "bg-[#121215] border-[#222226] text-zinc-400 hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Faded Example IDE
              </button>

              <button
                onClick={() => {
                  setActiveEngineMode("parsons");
                  setChallengeType("parsons");
                }}
                className={`px-3 py-1 border flex items-center gap-1.5 transition-all text-xs font-bold ${
                  activeEngineMode === "parsons"
                    ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699]"
                    : "bg-[#121215] border-[#222226] text-zinc-400 hover:text-white"
                }`}
              >
                <ListTree className="w-3.5 h-3.5" />
                Parsons Problem
              </button>

              <button
                onClick={() => setActiveEngineMode("visual")}
                className={`px-3 py-1 border flex items-center gap-1.5 transition-all text-xs font-bold ${
                  activeEngineMode === "visual"
                    ? "bg-[#00E699]/15 border-[#00E699] text-[#00E699]"
                    : "bg-[#121215] border-[#222226] text-zinc-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Visual Sandbox
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-zinc-500 hidden lg:inline">{activeTrack.badge} Active</span>
              <button
                onClick={resetLesson}
                title="Reset Challenge"
                className="p-1 text-zinc-400 hover:text-white bg-[#121215] border border-[#222226] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Interactive Canvas Area */}
          <div className="flex-1 w-full h-full relative overflow-hidden bg-[#0A0A0C]">
            {activeEngineMode === "parsons" && <ParsonsEngine />}

            {activeEngineMode === "ide" && (
              <SpineMonacoEditor
                value={fadedCode}
                onChange={setFadedCode}
                language={activeLesson.language}
                lockedLines={lockedLines}
              />
            )}

            {activeEngineMode === "visual" && (
              <VisualSandbox
                initialHtml={selectedTrackId === "html" ? fadedCode : undefined}
                initialCss={selectedTrackId === "css" ? fadedCode : undefined}
                initialJs={selectedTrackId === "javascript" ? fadedCode : undefined}
                onConsoleLog={handleConsoleLogFromVisual}
              />
            )}
          </div>

          {/* TERMINAL OUTPUT PANEL */}
          <div className="border-t border-[#222226] bg-[#0E0E11] flex flex-col h-44">
            {/* Terminal Header */}
            <div className="px-4 py-2 bg-[#121215] border-b border-[#222226] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-300 font-bold">
                <Terminal className="w-3.5 h-3.5 text-[#00E699]" />
                <span>TERMINAL LOG CONSOLE</span>
                <span className="text-[#00E699] bg-[#00E699]/10 px-1.5 py-0.5 text-[10px] border border-[#00E699]/30">
                  LIVE DB SYNC
                </span>
              </div>
              <span className="text-[11px] text-zinc-500">{activeTrack.badge}</span>
            </div>

            {/* Terminal Log Console */}
            <div className="p-3 font-mono text-xs text-zinc-300 space-y-1 bg-[#0A0A0C] flex-1 overflow-y-auto">
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith("✓")
                      ? "text-[#00E699] font-medium"
                      : line.startsWith("✨") || line.startsWith("🎉")
                      ? "text-amber-300 font-bold"
                      : line.startsWith("❌")
                      ? "text-rose-400 font-bold"
                      : "text-zinc-400"
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
