"use client";

import { useCallback, useEffect, useState } from "react";

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  message?: string;
}

interface MutationOptions {
  method: "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Query string appended to the collection endpoint, e.g. `?id=abc`. */
  query?: string;
}

/**
 * Load + mutate state for an admin collection endpoint.
 *
 * Owns the fetch/loading/error/refetch lifecycle that the hotlines, grants and
 * applications pages previously reimplemented line for line.
 */
export function useAdminCollection<T>(endpoint: string, fallbackError: string) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint);
      const json = (await res.json()) as ApiEnvelope<T[]>;
      if (json.status === "success" && Array.isArray(json.data)) {
        setItems(json.data);
      } else {
        setError(json.message ?? fallbackError);
      }
    } catch {
      setError(fallbackError);
    } finally {
      setLoading(false);
    }
  }, [endpoint, fallbackError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const mutate = useCallback(
    async ({ method, body, query = "" }: MutationOptions) => {
      setError(null);
      try {
        const res = await fetch(`${endpoint}${query}`, {
          method,
          headers: body === undefined ? undefined : { "Content-Type": "application/json" },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
        const json = (await res.json()) as ApiEnvelope<unknown>;
        if (json.status === "success") {
          await refresh();
          return true;
        }
        setError(json.message ?? fallbackError);
        return false;
      } catch {
        setError(fallbackError);
        return false;
      }
    },
    [endpoint, fallbackError, refresh]
  );

  return { items, loading, error, setError, refresh, mutate };
}
