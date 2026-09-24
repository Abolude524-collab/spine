import { NextResponse } from "next/server";
import { getLiveCurriculum, addLessonToCurriculum, deleteLessonFromCurriculum } from "@/lib/db";
import { Track } from "@/data/curriculumData";

export async function GET() {
  const fullCurriculum = (await getLiveCurriculum()) as Record<string, Track>;
  return NextResponse.json({
    success: true,
    tracks: Object.values(fullCurriculum),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trackId, moduleId, lesson } = body;

    if (!trackId || !moduleId || !lesson || !lesson.title) {
      return NextResponse.json(
        { success: false, error: "trackId, moduleId, and complete lesson object are required." },
        { status: 400 }
      );
    }

    const createdLesson = await addLessonToCurriculum(trackId, moduleId, lesson);

    return NextResponse.json({
      success: true,
      message: `Lesson '${createdLesson.title}' published live to database!`,
      lesson: createdLesson,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to publish lesson." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("trackId");
    const lessonId = searchParams.get("lessonId");

    if (!trackId || !lessonId) {
      return NextResponse.json(
        { success: false, error: "trackId and lessonId are required." },
        { status: 400 }
      );
    }

    const success = await deleteLessonFromCurriculum(trackId, lessonId);
    return NextResponse.json({
      success,
      message: success ? "Lesson removed from live database." : "Lesson not found.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to delete lesson." },
      { status: 500 }
    );
  }
}
