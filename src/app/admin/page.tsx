"use client";

import React, { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import AuthModal from "@/components/AuthModal";
import { useUserStore } from "@/store/useUserStore";
import {
  Shield,
  Users,
  BookOpen,
  Zap,
  BarChart3,
  PlusCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, setIsAuthModalOpen } = useUserStore();
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "users">("overview");

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Lesson Form State
  const [selectedTrackId, setSelectedTrackId] = useState("python");
  const [selectedModuleId, setSelectedModuleId] = useState("py-01");
  const [lessonTitle, setLessonTitle] = useState("");
  const [readTime, setReadTime] = useState("3 mins read");
  const [language, setLanguage] = useState<"python" | "html" | "css" | "javascript">("python");
  const [instructionalText, setInstructionalText] = useState("");
  const [initialCode, setInitialCode] = useState("");
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, curriculumRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/users"),
        fetch("/api/admin/curriculum"),
      ]);

      const analyticsData = await analyticsRes.json();
      const usersData = await usersRes.json();
      const curriculumData = await curriculumRes.json();

      if (analyticsData.success) setAnalytics(analyticsData.analytics);
      if (usersData.success) setUserList(usersData.users);
      if (curriculumData.success) setTracks(curriculumData.tracks);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "student" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);

    const payload = {
      trackId: selectedTrackId,
      moduleId: selectedModuleId,
      lesson: {
        title: lessonTitle,
        readTime,
        type: "faded_example",
        language,
        instructionalText: instructionalText || "Custom lesson created via Admin Panel.",
        mentalModelTitle: "MENTAL MODEL: ADMIN CUSTOM",
        mentalModelDescription: "Custom mental model concept",
        mentalModelItems: ["Step 1", "Step 2", "Step 3"],
        verificationSteps: [
          { id: 1, text: "Verify custom logic string" },
          { id: 2, text: "Execute sandbox assertions" },
        ],
        initialCode: initialCode || `# Custom Admin Lesson Code\nprint("Hello from Admin!")`,
        lockedLines: [1],
        parsonsBlocks: [{ id: "p1", text: 'print("Hello from Admin!")', indent: 0 }],
        expectedParsons: [{ id: "p1", indent: 0 }],
      },
    };

    try {
      const res = await fetch("/api/admin/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess(`Lesson '${lessonTitle}' added successfully!`);
        setLessonTitle("");
        setInitialCode("");
        setInstructionalText("");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Failed to add lesson", err);
    }
  };

  // RBAC Access Guard
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans">
        <TopNav />
        <AuthModal />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold font-mono">Restricted Access</h1>
          <p className="text-xs text-zinc-400 max-w-sm">
            The Admin Control Center requires an authenticated <strong>Admin Lead</strong> account.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 bg-[#00E699] text-black font-mono font-bold text-xs uppercase"
          >
            Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 flex flex-col font-sans select-none">
      <TopNav />
      <AuthModal />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222226] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin Control Center
              </span>
              <span className="text-xs font-mono text-zinc-500">• Spine Engine v1.0</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Platform Administration</h1>
          </div>

          <button
            onClick={fetchAdminData}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141418] border border-[#222226] hover:border-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#222226] font-mono text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "overview"
                ? "border-[#00E699] text-[#00E699] bg-[#00E699]/5"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview & Telemetry
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "curriculum"
                ? "border-[#00E699] text-[#00E699] bg-[#00E699]/5"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Curriculum Manager
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "users"
                ? "border-[#00E699] text-[#00E699] bg-[#00E699]/5"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" /> Users & Permissions
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="spine-card p-5 space-y-2 bg-[#121215]">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>TOTAL REGISTERED</span>
                  <Users className="w-4 h-4 text-[#00E699]" />
                </div>
                <div className="text-3xl font-extrabold text-white font-sans">
                  {analytics?.totalUsers || 2}
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  {analytics?.activeLearners || 1} Active Student Learners
                </div>
              </div>

              <div className="spine-card p-5 space-y-2 bg-[#121215]">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>TOTAL XP AWARDED</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold font-sans text-amber-400">
                  {analytics?.totalXpAwarded || 1600}
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  Across all interactive sandbox runs
                </div>
              </div>

              <div className="spine-card p-5 space-y-2 bg-[#121215]">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>LESSONS COMPLETED</span>
                  <CheckCircle2 className="w-4 h-4 text-[#00E699]" />
                </div>
                <div className="text-3xl font-extrabold text-white font-sans">
                  {analytics?.totalCompletedLessons || 4}
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  Faded examples & Parsons problems
                </div>
              </div>

              <div className="spine-card p-5 space-y-2 bg-[#121215]">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>ADMIN LEADS</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white font-sans">
                  {analytics?.adminCount || 1}
                </div>
                <div className="text-[11px] font-mono text-zinc-500">
                  Full administrative permissions
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="spine-card p-6 space-y-4 bg-[#0D0D10]">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00E699]" /> Platform Control Diagnostics
              </h3>
              <p className="text-xs text-zinc-400">
                Spine telemetry evaluates client-side Pyodide WASM execution rates, lesson completion times, and user retention.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
                <div className="p-3 bg-[#0A0A0C] border border-[#222226]">
                  <span className="text-zinc-500 block text-[10px]">WASM RUNTIME BOOT</span>
                  <span className="text-[#00E699] font-bold text-sm">12ms (Optimal)</span>
                </div>
                <div className="p-3 bg-[#0A0A0C] border border-[#222226]">
                  <span className="text-zinc-500 block text-[10px]">PARSONS VALIDATION RATE</span>
                  <span className="text-amber-400 font-bold text-sm">94.2% Pass Rate</span>
                </div>
                <div className="p-3 bg-[#0A0A0C] border border-[#222226]">
                  <span className="text-zinc-500 block text-[10px]">ACTIVE CURRICULUM TRACKS</span>
                  <span className="text-white font-bold text-sm">4 Tracks (Python, HTML, CSS, JS)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CURRICULUM MANAGER */}
        {activeTab === "curriculum" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active Curriculum Explorer (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#00E699]" /> Live Curriculum Catalog
              </h3>

              <div className="space-y-4">
                {tracks.map((t) => (
                  <div key={t.id} className="spine-card p-5 space-y-3 bg-[#121215]">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-[#00E699] font-bold uppercase">{t.badge}</span>
                      <span className="text-zinc-500">{t.modules?.length || 0} Modules</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">{t.title}</h4>
                    <p className="text-xs text-zinc-400">{t.description}</p>

                    <div className="space-y-2 pt-2 border-t border-[#222226]">
                      {t.modules?.map((m: any) => (
                        <div key={m.id} className="p-3 bg-[#0A0A0C] border border-[#222226] space-y-2">
                          <div className="text-xs font-mono text-zinc-300 font-bold">{m.title}</div>
                          <div className="space-y-1 font-mono text-[11px]">
                            {m.lessons?.map((l: any) => (
                              <div key={l.id} className="flex items-center justify-between text-zinc-400">
                                <span>• {l.title}</span>
                                <span className="text-zinc-600">{l.readTime}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Add New Lesson Form (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#00E699]" /> Add New Lesson Module
              </h3>

              <form onSubmit={handleAddLesson} className="spine-card p-5 space-y-4 bg-[#0D0D10] border-[#222226]">
                {formSuccess && (
                  <div className="p-3 bg-[#00E699]/10 border border-[#00E699]/40 text-[#00E699] text-xs font-mono">
                    ✓ {formSuccess}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Select Target Track
                  </label>
                  <select
                    value={selectedTrackId}
                    onChange={(e) => setSelectedTrackId(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0A0C] border border-[#222226] text-xs font-mono text-white focus:outline-none focus:border-[#00E699]"
                  >
                    <option value="python">🐍 Python Track</option>
                    <option value="html">🌐 HTML Track</option>
                    <option value="css">🎨 CSS Track</option>
                    <option value="javascript">⚡ JavaScript Track</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master List Comprehensions"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0A0C] border border-[#222226] text-xs font-mono text-white focus:outline-none focus:border-[#00E699]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Instructional Explanation
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a clear, mental-model based explanation..."
                    value={instructionalText}
                    onChange={(e) => setInstructionalText(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0A0C] border border-[#222226] text-xs font-mono text-white focus:outline-none focus:border-[#00E699]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    Initial Faded Code Snippet
                  </label>
                  <textarea
                    rows={4}
                    placeholder="# Provide initial code with faded slots..."
                    value={initialCode}
                    onChange={(e) => setInitialCode(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0A0C] border border-[#222226] text-xs font-mono text-white focus:outline-none focus:border-[#00E699]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00E699] hover:bg-[#00FF9D] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Publish Lesson to Catalog
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00E699]" /> User Accounts & Permissions
            </h3>

            <div className="spine-card overflow-x-auto bg-[#0D0D10]">
              <table className="w-full text-left font-mono text-xs divide-y divide-[#222226]">
                <thead className="bg-[#0A0A0C] text-zinc-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">User Profile</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">XP Score</th>
                    <th className="p-3">Streak</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222226] text-zinc-300">
                  {userList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#141418] transition-colors">
                      <td className="p-3 font-bold text-white">{u.name}</td>
                      <td className="p-3 text-zinc-400">{u.email}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                            u.role === "admin"
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                              : "bg-[#00E699]/10 border-[#00E699]/40 text-[#00E699]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-amber-300">{u.xp} XP</td>
                      <td className="p-3 text-zinc-400">{u.streak} days</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleRoleToggle(u.id, u.role)}
                          className="px-2.5 py-1 bg-[#16161A] border border-[#222226] hover:border-zinc-600 text-zinc-300 transition-colors text-[11px]"
                        >
                          Toggle {u.role === "admin" ? "to Student" : "to Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
