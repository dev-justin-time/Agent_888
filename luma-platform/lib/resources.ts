import { prisma } from "./prisma.ts";
import { parseTags } from "./utils.ts";

/**
 * Hotline and grant lookups shared by `app/api/resources` and the deployed
 * `blocks/luma-resources` agent.
 */

export type ResourceNeed = "hotline" | "sponsor" | "community";

export const HOTLINE_MESSAGE = "Here is a safe, immediate connection in your area.";
export const ASSISTANCE_MESSAGE = "Here are organizations that offer payment assistance.";

/** Hotline for the locale, falling back to the US entry. */
export async function getHotline(locale: string) {
  return (
    (await prisma.hotline.findUnique({ where: { locale } })) ??
    (await prisma.hotline.findUnique({ where: { locale: "US" } }))
  );
}

/**
 * Grants for a need, with SQLite tag strings parsed. Sponsors are limited to the
 * locale or globally available funds; other needs list the whole directory.
 */
export async function getGrants(need: ResourceNeed, locale: string) {
  const grants = await prisma.grant.findMany({
    where:
      need === "sponsor"
        ? { OR: [{ coverage: locale }, { coverage: "Global" }] }
        : undefined,
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });

  return grants.map((grant) => ({ ...grant, tags: parseTags(grant.tags) }));
}
