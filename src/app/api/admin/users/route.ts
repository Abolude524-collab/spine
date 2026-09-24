import { NextResponse } from "next/server";
import { getAllUsers, updateUserRole } from "@/lib/db";

export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json({
      success: true,
      users,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch registered users." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role || (role !== "admin" && role !== "student")) {
      return NextResponse.json(
        { success: false, error: "Valid userId and role ('admin' | 'student') are required." },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserRole(userId, role);
    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}.`,
      user: updatedUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update user role." },
      { status: 500 }
    );
  }
}
