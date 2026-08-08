import type { HandlerResult, StartTaskMessage, TaskContext } from "@blocks-network/sdk";
import { prisma } from "../../lib/prisma.ts";
import { getTaskText, jsonResult, jsonError, parseTaskJson } from "../shared/handler-utils.ts";

interface ResourceInput {
  locale?: string;
  need?: "hotline" | "sponsor" | "community";
}

const DEFAULT_INPUT: ResourceInput = { locale: "US", need: "community" };

export default async function handler(
  task: StartTaskMessage,
  ctx?: TaskContext
): Promise<HandlerResult> {
  const input = parseTaskJson<ResourceInput>(task, DEFAULT_INPUT);
  const locale = (input.locale || "US").toUpperCase();
  const need = input.need || "community";

  ctx?.reportStatus(`Finding ${need} support for ${locale}...`);
  try {
    if (need === "hotline") {
      const hotline =
        (await prisma.hotline.findUnique({ where: { locale } })) ??
        (await prisma.hotline.findUnique({ where: { locale: "US" } }));
      return jsonResult({
        status: "success",
        type: "hotline",
        data: hotline,
        message: "Here is a safe, immediate connection in your area.",
        billed_amount: 0,
      });
    }

    const grants = await prisma.grant.findMany({
      where:
        need === "sponsor"
          ? { OR: [{ coverage: locale }, { coverage: "Global" }] }
          : undefined,
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });

    return jsonResult({
      status: "success",
      type: need,
      data: grants,
      message: "Here are organizations that offer payment assistance.",
      billed_amount: 0,
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Resources unavailable");
  }
}
