import { NextResponse } from "next/server";
import { getCurrentUserId, getUserById } from "@/lib/db";

export async function GET() {
  try {
    const currentId = await getCurrentUserId();
    const user = await getUserById(currentId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User session expired or not found." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch session user." },
      { status: 500 }
    );
  }
}
