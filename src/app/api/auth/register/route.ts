import { NextResponse } from "next/server";
import { registerUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required." },
        { status: 400 }
      );
    }

    const user = await registerUser(name, email, role || "student");

    return NextResponse.json({
      success: true,
      message: "Account registered successfully.",
      user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to register account." },
      { status: 400 }
    );
  }
}
