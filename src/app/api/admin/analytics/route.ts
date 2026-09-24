import { NextResponse } from "next/server";
import { getPlatformAnalytics } from "@/lib/db";

export async function GET() {
  try {
    const analytics = await getPlatformAnalytics();
    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch platform analytics." },
      { status: 500 }
    );
  }
}
