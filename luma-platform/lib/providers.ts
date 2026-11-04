import { prisma } from "./prisma.ts";
import { parseTags } from "./utils.ts";
import type { ProviderType } from "./types.ts";

/**
 * Provider directory logic shared by `app/api/providers` and the deployed
 * `blocks/luma-community` agent. Both used to carry their own copy of the
 * locale matcher, the handoff URL, and the privacy copy below.
 */

/** Verification label shown on every handoff. */
export const VERIFICATION_STATUS = "Verified via National Registry";

/** Shown before a user leaves Luma for a provider's own booking system. */
export const PRIVACY_NOTICE =
  "Clicking this link will take you off Luma to the provider's secure booking system. Luma does not store your name, data, or session details. This interaction is completely anonymous.";

/** Returned when no verified provider covers the requested locale. */
export const NO_PROVIDER_MESSAGE =
  "No verified providers currently available in your specific locale. Please check back soon or use the Hotline feature.";

/** The verified provider directory, with SQLite tag strings parsed. */
export async function getVerifiedProviders() {
  const providers = await prisma.provider.findMany({
    where: { verified: true },
    orderBy: { name: "asc" },
  });

  return providers.map((provider) => ({
    ...provider,
    tags: parseTags(provider.tags),
  }));
}

/**
 * Pick the provider for a locale: an exact match wins, then any provider in the
 * same country (`US-NY` falls back to `US…`). Case-insensitive.
 */
export function matchProvider<T extends { locale: string }>(
  providers: T[],
  locale: string
): T | undefined {
  const normalized = locale.toUpperCase();
  const country = normalized.split("-")[0];
  return providers.find(
    (provider) =>
      provider.locale === normalized || provider.locale.startsWith(country)
  );
}

/** Anonymized handoff link handed to the user instead of provider contact data. */
export function buildHandoffLink(providerId: string, issuedAt = Date.now()): string {
  return `https://luma.link/bridge/${providerId}?token=${issuedAt}`;
}

/** The connect payload both entry points return to their caller. */
export function buildConnection(provider: { id: string; name: string; cost: string }) {
  return {
    provider: {
      name: provider.name,
      cost: provider.cost,
      verification_status: VERIFICATION_STATUS,
    },
    secure_handoff_link: buildHandoffLink(provider.id),
    privacy_notice: PRIVACY_NOTICE,
  };
}

/**
 * Find a verified provider of `type` covering `locale` and build its handoff
 * payload. Returns `null` when nothing covers the locale — the caller decides
 * how to express that (HTTP error vs. agent payload).
 */
export async function findProviderConnection(type: ProviderType, locale: string) {
  const providers = await prisma.provider.findMany({ where: { type } });
  const matched = matchProvider(providers, locale);
  return matched ? buildConnection(matched) : null;
}
