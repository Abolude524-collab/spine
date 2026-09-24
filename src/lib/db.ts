// Backend Data Store & Database Engine for Spine
import { TRACKS, Track, Lesson, Module } from "@/data/curriculumData";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  xp: number;
  streak: number;
  completedModules: string[];
  completedLessons: string[];
  lastActive: string;
  createdAt: string;
}

export interface PlatformAnalytics {
  totalUsers: number;
  activeLearners: number;
  adminCount: number;
  totalXpAwarded: number;
  totalCompletedLessons: number;
  completionRate: number;
}

// Live Curriculum Store initialized from seed data
let liveCurriculumStore: Record<string, Track> = JSON.parse(JSON.stringify(TRACKS));

// In-Memory User Store (Initial Seed)
const usersStore: Record<string, UserAccount> = {
  "admin-01": {
    id: "admin-01",
    name: "Admin Lead",
    email: "admin@spine.dev",
    role: "admin",
    xp: 1250,
    streak: 14,
    completedModules: ["py-01", "html-01"],
    completedLessons: ["py-01-01", "py-01-02", "html-01-01"],
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "student-01": {
    id: "student-01",
    name: "Enoch Abolude",
    email: "enoch@example.com",
    role: "student",
    xp: 350,
    streak: 7,
    completedModules: ["py-01"],
    completedLessons: ["py-01-01"],
    lastActive: new Date().toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

// Current Session Helper
let currentActiveUserId: string = "student-01";

export async function getCurrentUserId(): Promise<string> {
  return currentActiveUserId;
}

export async function setCurrentUserId(userId: string): Promise<void> {
  if (usersStore[userId]) {
    currentActiveUserId = userId;
  }
}

export async function getUserById(userId: string): Promise<UserAccount | null> {
  return usersStore[userId] || null;
}

export async function getUserByEmail(email: string): Promise<UserAccount | null> {
  const found = Object.values(usersStore).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  return found || null;
}

export async function getAllUsers(): Promise<UserAccount[]> {
  return Object.values(usersStore);
}

export async function registerUser(
  name: string,
  email: string,
  role: "admin" | "student" = "student"
): Promise<UserAccount> {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error("User with this email already exists.");
  }

  const newId = `user-${Date.now()}`;
  const newUser: UserAccount = {
    id: newId,
    name,
    email,
    role,
    xp: 100, // Welcome bonus
    streak: 1,
    completedModules: [],
    completedLessons: [],
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  usersStore[newId] = newUser;
  currentActiveUserId = newId;
  return newUser;
}

export async function updateUserRole(
  userId: string,
  role: "admin" | "student"
): Promise<UserAccount> {
  const user = usersStore[userId];
  if (!user) throw new Error("User not found.");
  user.role = role;
  return user;
}

export async function updateUserProgress(
  userId: string,
  delta: Partial<UserAccount>
): Promise<UserAccount> {
  const user = usersStore[userId] || (await registerUser("Learner", "learner@spine.dev"));
  
  if (delta.xp !== undefined) user.xp += delta.xp;
  if (delta.streak !== undefined) user.streak = delta.streak;
  if (delta.completedLessons) {
    user.completedLessons = Array.from(new Set([...user.completedLessons, ...delta.completedLessons]));
  }
  if (delta.completedModules) {
    user.completedModules = Array.from(new Set([...user.completedModules, ...delta.completedModules]));
  }
  user.lastActive = new Date().toISOString();

  return user;
}

// ==========================================
// CURRICULUM DB ENGINE API
// ==========================================

export async function getLiveCurriculum(trackId?: string): Promise<Record<string, Track> | Track | null> {
  if (trackId) {
    return liveCurriculumStore[trackId] || null;
  }
  return liveCurriculumStore;
}

export async function addLessonToCurriculum(
  trackId: string,
  moduleId: string,
  lessonData: Partial<Lesson>
): Promise<Lesson> {
  const track = liveCurriculumStore[trackId];
  if (!track) throw new Error(`Track ${trackId} not found in database.`);

  let targetModule = track.modules.find((m) => m.id === moduleId);
  if (!targetModule) {
    targetModule = {
      id: moduleId,
      title: `Module ${track.modules.length + 1} • Advanced Operations`,
      description: "Custom admin published module",
      lessons: [],
    };
    track.modules.push(targetModule);
  }

  const lessonId = lessonData.id || `${moduleId}-${targetModule.lessons.length + 1}`;

  const fullLesson: Lesson = {
    id: lessonId,
    title: lessonData.title || "Custom Published Lesson",
    readTime: lessonData.readTime || "3 mins read",
    type: lessonData.type || "faded_example",
    language: (lessonData.language as any) || (trackId as any),
    instructionalText: lessonData.instructionalText || "Admin published interactive lesson.",
    mentalModelTitle: lessonData.mentalModelTitle || "MENTAL MODEL: ADMIN PUBLISHED",
    mentalModelDescription: lessonData.mentalModelDescription || "Active recall mental model concept.",
    mentalModelItems: lessonData.mentalModelItems || ["Step 1", "Step 2", "Step 3"],
    verificationSteps: lessonData.verificationSteps || [
      { id: 1, text: "Verify code syntax execution" },
      { id: 2, text: "Run sandbox test suite" },
    ],
    initialCode: lessonData.initialCode || `# Admin Published Lesson Code\nprint("Hello World!")`,
    lockedLines: lessonData.lockedLines || [1],
    parsonsBlocks: lessonData.parsonsBlocks || [
      { id: "p1", text: 'print("Hello World!")', indent: 0 },
    ],
    expectedParsons: lessonData.expectedParsons || [{ id: "p1", indent: 0 }],
  };

  targetModule.lessons.push(fullLesson);
  return fullLesson;
}

export async function deleteLessonFromCurriculum(
  trackId: string,
  lessonId: string
): Promise<boolean> {
  const track = liveCurriculumStore[trackId];
  if (!track) return false;

  for (const mod of track.modules) {
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);
    if (idx !== -1) {
      mod.lessons.splice(idx, 1);
      return true;
    }
  }
  return false;
}

export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
  const users = Object.values(usersStore);
  const totalUsers = users.length;
  const activeLearners = users.filter((u) => u.role === "student").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const totalXpAwarded = users.reduce((acc, u) => acc + u.xp, 0);
  const totalCompletedLessons = users.reduce(
    (acc, u) => acc + u.completedLessons.length,
    0
  );

  return {
    totalUsers,
    activeLearners,
    adminCount,
    totalXpAwarded,
    totalCompletedLessons,
    completionRate: totalUsers > 0 ? Math.round((totalCompletedLessons / (totalUsers * 6)) * 100) : 0,
  };
}
