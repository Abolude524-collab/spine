import { NextResponse } from "next/server";
import { getLiveCurriculum } from "@/lib/db";
import { Track } from "@/data/curriculumData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get("track");

  const fullCurriculum = (await getLiveCurriculum()) as Record<string, Track>;

  if (trackId && fullCurriculum[trackId]) {
    return NextResponse.json({
      success: true,
      track: fullCurriculum[trackId],
    });
  }

  return NextResponse.json({
    success: true,
    tracks: fullCurriculum,
  });
}
