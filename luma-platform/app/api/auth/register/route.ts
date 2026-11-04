import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validation";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { fail, parseBody, rateLimited, runRoute, success } from "@/lib/api";

export async function POST(req: NextRequest) {
  const limit = rateLimit(req, "register", RATE_LIMITS.register);
  if (!limit.success) {
    return rateLimited(limit, "Too many registration attempts. Please try again later.");
  }

  const body = await parseBody(req, RegisterSchema);
  if ("response" in body) return body.response;

  const { email, password } = body.data;

  return runRoute(
    "Registration error",
    async () => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return fail("An account with this email already exists", 409);
      }

      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword: await bcrypt.hash(password, 12),
          role: "PROVIDER",
        },
      });

      return success({
        user: { id: user.id, email: user.email, role: user.role },
      });
    },
    "Could not create account"
  );
}
