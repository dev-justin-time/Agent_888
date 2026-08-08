import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stringifyTags } from "@/lib/utils";
import { ProviderApplySchema, formatValidationError } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = ProviderApplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const { name, cost, description, tags, type } = parsed.data;

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
        type,
        cost,
        description,
        tags: stringifyTags(tags),
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
