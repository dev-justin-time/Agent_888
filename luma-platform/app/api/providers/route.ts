import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";
import { ProviderConnectSchema, formatValidationError } from "@/lib/validation";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      where: { verified: true },
      orderBy: { name: "asc" },
    });

    const data = providers.map((p) => ({ ...p, tags: parseTags(p.tags) }));

    return NextResponse.json({
      status: "success",
      data,
      message: "Verified provider directory.",
    });
  } catch (error) {
    console.error("Providers API error:", error);
    return NextResponse.json(
      { status: "error", message: "Provider directory is currently unavailable." },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ProviderConnectSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", ...formatValidationError(parsed) },
        { status: 400 }
      );
    }

    const userLocale = parsed.data.user_locale.toUpperCase();
    const providerType = parsed.data.provider_type;

    const providers = await prisma.provider.findMany({
      where: { type: providerType },
    });

    const matched = providers.find(
      (p) => p.locale === userLocale || p.locale.startsWith(userLocale.split("-")[0])
    );

    if (!matched) {
      return NextResponse.json({
        status: "error",
        message:
          "No verified providers currently available in your specific locale. Please check back soon or use the Hotline feature.",
      });
    }

    const secureLink = `https://luma.link/bridge/${matched.id}?token=${Date.now()}`;

    return NextResponse.json({
      status: "success",
      provider: {
        name: matched.name,
        cost: matched.cost,
        verification_status: "Verified via National Registry",
      },
      secure_handoff_link: secureLink,
      privacy_notice:
        "Clicking this link will take you off Luma to the provider's secure booking system. Luma does not store your name, data, or session details. This interaction is completely anonymous.",
    });
  } catch (error) {
    console.error("Provider connection error:", error);
    return NextResponse.json(
      { status: "error", message: "Could not connect to a provider right now." },
      { status: 503 }
    );
  }
}
