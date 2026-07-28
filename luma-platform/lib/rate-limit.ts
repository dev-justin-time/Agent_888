import { NextRequest } from "next/server";

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

interface Hit {
  count: number;
  resetAt: number;
}

const store = new Map<string, Hit>();

function safeRateLimitConfig(
  windowEnv: string | undefined,
  maxEnv: string | undefined,
  defaults: RateLimitConfig
): RateLimitConfig {
  const windowMs = Number(windowEnv);
  const maxRequests = Number(maxEnv);
  return {
    windowMs: Number.isFinite(windowMs) && windowMs > 0 ? windowMs : defaults.windowMs,
    maxRequests: Number.isFinite(maxRequests) && maxRequests > 0 ? maxRequests : defaults.maxRequests,
  };
}

const DEFAULT_REGISTER_LIMIT: RateLimitConfig = safeRateLimitConfig(
  process.env.RATE_LIMIT_REGISTER_WINDOW_MS,
  process.env.RATE_LIMIT_REGISTER_MAX,
  { windowMs: 60 * 60 * 1000, maxRequests: 5 }
);

const DEFAULT_CHAT_LIMIT: RateLimitConfig = safeRateLimitConfig(
  process.env.RATE_LIMIT_CHAT_WINDOW_MS,
  process.env.RATE_LIMIT_CHAT_MAX,
  { windowMs: 60 * 1000, maxRequests: 30 }
);

export const RATE_LIMITS = {
  register: DEFAULT_REGISTER_LIMIT,
  chat: DEFAULT_CHAT_LIMIT,
};

function getClientIp(req: NextRequest): string {
  if (req.ip) {
    return req.ip;
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "anonymous";
}

function makeKey(req: NextRequest, prefix: string): string {
  return `${prefix}:${getClientIp(req)}`;
}

function cleanupExpired(now: number) {
  for (const [key, hit] of store.entries()) {
    if (now >= hit.resetAt) {
      store.delete(key);
    }
  }
}

export function rateLimit(req: NextRequest, prefix: string, config: RateLimitConfig) {
  const key = makeKey(req, prefix);
  const now = Date.now();

  cleanupExpired(now);

  const existing = store.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      retryAfter: 0,
    };
  }

  if (existing.count >= config.maxRequests) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      retryAfter,
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - existing.count,
    retryAfter: 0,
  };
}
