import { NextResponse } from "next/server";
import { getCurrentUserId, getUserById, updateUserProgress } from "@/lib/db";

export async function GET() {
  const currentId = await getCurrentUserId();
  const user = await getUserById(currentId);
  return NextResponse.json({
    success: true,
    progress: user,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { xpDelta, lessonId, moduleId } = body;

    const currentId = await getCurrentUserId();
    const user = await getUserById(currentId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User session not found." },
        { status: 401 }
      );
    }

    const updated = await updateUserProgress(currentId, {
      xp: xpDelta || 0,
      completedLessons: lessonId ? [lessonId] : [],
      completedModules: moduleId ? [moduleId] : [],
    });

    return NextResponse.json({
      success: true,
      progress: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Invalid progress update payload" },
      { status: 400 }
    );
  }
}
