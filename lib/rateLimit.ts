import { NextRequest, NextResponse } from 'next/server'

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-memory store — works for single-instance deployments.
// For multi-instance/serverless scale, replace with Redis (e.g. Upstash).
const store = new Map<string, RateLimitRecord>()

// Prune expired entries every 5 minutes to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store) {
    if (now > record.resetAt) store.delete(key)
  }
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
}

/**
 * Returns a 429 NextResponse if the IP has exceeded the limit, otherwise null.
 *
 * Usage:
 *   const limited = rateLimit(req, { limit: 5, windowMs: 60_000 })
 *   if (limited) return limited
 */
export function rateLimit(req: NextRequest, options: RateLimitOptions): NextResponse | null {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const key = `${ip}:${req.nextUrl.pathname}`
  const now = Date.now()
  const record = store.get(key)

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return null
  }

  record.count += 1

  if (record.count > options.limit) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    )
  }

  return null
}
