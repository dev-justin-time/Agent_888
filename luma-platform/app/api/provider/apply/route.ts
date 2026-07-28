import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProviderType } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, cost, description, tags, type } = body;

    if (!name || !cost || !description || !type) {
      return NextResponse.json(
        { status: "error", message: "Missing required application fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" }, { status: 404 });
    }

    const existing = await prisma.providerApplication.findUnique({
      where: { userId: user.id },
    });

    if (existing) {
      return NextResponse.json(
        { status: "error", message: "You have already submitted an application" },
        { status: 409 }
      );
    }

    const application = await prisma.providerApplication.create({
      data: {
        userId: user.id,
        name,
        type: type as ProviderType,
        cost,
        description,
        tags: Array.isArray(tags) ? tags : [],
      },
    });

    return NextResponse.json({
      status: "success",
      application: {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt,
      },
      message: "Application submitted. Our team will review it shortly.",
    });
  } catch (error) {
    console.error("Provider application error:", error);
    return NextResponse.json(
      { status: "error", message: "Could not submit application" },
      { status: 500 }
    );
  }
}
