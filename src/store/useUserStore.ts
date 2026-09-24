import { create } from "zustand";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  xp: number;
  streak: number;
  completedModules: string[];
  completedLessons: string[];
}

export interface UserState {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  xp: number;
  streak: number;
  moduleProgress: number;
  activeModuleTitle: string;
  activeLessonTitle: string;

  // Actions
  setIsAuthModalOpen: (open: boolean) => void;
  setUser: (user: UserAccount | null) => void;
  addXp: (amount: number) => void;
  setModuleProgress: (progress: number) => void;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, role?: "admin" | "student") => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  syncSession: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: {
    id: "admin-01",
    name: "Admin Lead",
    email: "admin@spine.dev",
    role: "admin",
    xp: 1250,
    streak: 14,
    completedModules: ["py-01"],
    completedLessons: ["py-01-01"],
  },
  isAuthenticated: true,
  isAuthModalOpen: false,
  xp: 1250,
  streak: 14,
  moduleProgress: 50,
  activeModuleTitle: "Module 01 • Fundamentals & Control Flow",
  activeLessonTitle: "Lesson 1: The Anatomy of a Loop",

  setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  
  setUser: (user) => {
    if (user) {
      set({
        user,
        isAuthenticated: true,
        xp: user.xp,
        streak: user.streak,
      });
    } else {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  addXp: (amount) => {
    set((state) => {
      const newXp = state.xp + amount;
      if (state.user) {
        state.user.xp = newXp;
      }
      return { xp: newXp };
    });
  },

  setModuleProgress: (progress) =>
    set({ moduleProgress: Math.min(100, Math.max(0, progress)) }),

  login: async (email) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        get().setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Login failed" };
    } catch {
      return { success: false, error: "Network error during login" };
    }
  },

  register: async (name, email, role = "student") => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        get().setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch {
      return { success: false, error: "Network error during registration" };
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      xp: 0,
      streak: 0,
    });
  },

  syncSession: async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success && data.user) {
        get().setUser(data.user);
      }
    } catch (err) {
      console.warn("Session sync check skipped", err);
    }
  },
}));
