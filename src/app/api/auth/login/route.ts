import { NextResponse } from "next/server";
import { getUserByEmail, setCurrentUserId } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user account found with this email." },
        { status: 404 }
      );
    }

    await setCurrentUserId(user.id);

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Login failed." },
      { status: 500 }
    );
  }
}
