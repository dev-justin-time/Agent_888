import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: "error", message: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: "PROVIDER",
      },
    });

    return NextResponse.json({
      status: "success",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { status: "error", message: "Could not create account" },
      { status: 500 }
    );
  }
}
