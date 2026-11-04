import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { formatValidationError } from "@/lib/validation";

/**
 * Shared API response envelopes and request-handling helpers.
 *
 * Every route used to repeat the same try/catch + `NextResponse.json` shape;
 * these helpers keep the contract (`{ status: "success" | "error", ... }`) in
 * one place so route handlers only describe what is unique to them.
 */

/** Success envelope: `{ status: "success", ...payload }`. */
export function success(payload: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json({ status: "success", ...payload }, init);
}

/** Success envelope with a single `data` field. */
export function ok<T>(data: T, init?: ResponseInit) {
  return success({ data }, init);
}

/** Error envelope: `{ status: "error", message }`. */
export function fail(message: string, status = 500) {
  return NextResponse.json({ status: "error", message }, { status });
}

/** 400 response for a failed schema parse (adds field issues in development). */
export function invalid<T>(result: { success: false; error: z.ZodError<T> }) {
  return NextResponse.json({ status: "error", ...formatValidationError(result) }, { status: 400 });
}

/** 429 response that carries the retry window. */
export function rateLimited(limit: { retryAfter: number }, message: string) {
  return NextResponse.json(
    { status: "error", message, retryAfter: limit.retryAfter },
    { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
  );
}

export type ParsedBody<T> = { data: T } | { response: NextResponse };

/** Read and validate a JSON request body. Narrow with `"response" in body`. */
export async function parseBody<S extends z.ZodTypeAny>(
  req: NextRequest,
  schema: S
): Promise<ParsedBody<z.infer<S>>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { response: fail("Request body must be valid JSON.", 400) };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return { response: invalid(parsed) };

  return { data: parsed.data as z.infer<S> };
}

/**
 * Run a route body with centralized error logging and a fallback response, so
 * handlers do not repeat their own try/catch.
 */
export async function runRoute(
  label: string,
  handler: () => Promise<NextResponse> | NextResponse,
  fallback: string,
  status = 500
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    console.error(`${label}:`, error);
    return fail(fallback, status);
  }
}

interface PrismaErrorMessages {
  /** Message for P2025 (record not found). */
  notFound: string;
  /** Message for P2002 (unique constraint). Omit when the model has no uniques. */
  conflict?: string;
}

/** Map Prisma's P2025/P2002 codes onto standard API errors; null otherwise. */
export function prismaError(error: unknown, messages: PrismaErrorMessages): NextResponse | null {
  const code = (error as { code?: string } | null | undefined)?.code;
  if (code === "P2025") return fail(messages.notFound, 404);
  if (code === "P2002" && messages.conflict) return fail(messages.conflict, 409);
  return null;
}

/** Required `id` query parameter from a request URL. */
export function queryId(req: NextRequest): string | null {
  const id = new URL(req.url).searchParams.get("id");
  return id ? id : null;
}
