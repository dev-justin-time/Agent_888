import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stringifyTags } from "@/lib/utils";
import { ProviderApplySchema } from "@/lib/validation";
import { fail, parseBody, runRoute, success } from "@/lib/api";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return fail("Unauthorized", 401);
  }

  const body = await parseBody(req, ProviderApplySchema);
  if ("response" in body) return body.response;

  const { name, cost, description, tags, type } = body.data;

  return runRoute(
    "Provider application error",
    async () => {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });

      if (!user) {
        return fail("User not found", 404);
      }

      const existing = await prisma.providerApplication.findUnique({
        where: { userId: user.id },
      });

      if (existing) {
        return fail("You have already submitted an application", 409);
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

      return success({
        application: {
          id: application.id,
          status: application.status,
          createdAt: application.createdAt,
        },
        message: "Application submitted. Our team will review it shortly.",
      });
    },
    "Could not submit application"
  );
}
