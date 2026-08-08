export function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function copyToClipboard(text: string) {
  if (typeof navigator === "undefined") return Promise.reject("Clipboard not available");
  return navigator.clipboard.writeText(text);
}

/**
 * Tags are stored as a JSON array string in SQLite (Prisma scalar lists are
 * Postgres-only). Safely parse back to an array, falling back to the legacy
 * comma-separated format. Always returns an array.
 */
export function parseTags(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === "string");
    }
  } catch {
    // Fall through to the legacy comma-separated format.
  }
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Serialize a tag array into the SQLite storage format (JSON string). */
export function stringifyTags(tags: string[] | null | undefined): string {
  return JSON.stringify(tags ?? []);
}
