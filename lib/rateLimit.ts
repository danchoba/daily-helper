import { NextRequest, NextResponse } from 'next/server'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
}

// ---------------------------------------------------------------------------
// In-memory fallback store (single-instance / local dev)
// ---------------------------------------------------------------------------

interface RateLimitRecord {
  count: number
  resetAt: number
}

const memoryStore = new Map<string, RateLimitRecord>()

// Prune expired entries every 5 minutes to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now()
  memoryStore.forEach((record, key) => {
    if (now > record.resetAt) memoryStore.delete(key)
  })
}, 5 * 60 * 1000)

function memoryRateLimit(key: string, options: RateLimitOptions): { limited: boolean; retryAfter: number } {
  const now = Date.now()
  const record = memoryStore.get(key)

  if (!record || now > record.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + options.windowMs })
    return { limited: false, retryAfter: 0 }
  }

  record.count += 1

  if (record.count > options.limit) {
    return { limited: true, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
  }

  return { limited: false, retryAfter: 0 }
}

// ---------------------------------------------------------------------------
// Upstash Redis rate limiter (production / multi-instance)
// Activated automatically when UPSTASH_REDIS_REST_URL and
// UPSTASH_REDIS_REST_TOKEN are set in the environment.
// ---------------------------------------------------------------------------

async function upstashRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<{ limited: boolean; retryAfter: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    // Env vars not set — fall back to in-memory
    return memoryRateLimit(key, options)
  }

  const windowSeconds = Math.ceil(options.windowMs / 1000)
  const encodedKey = encodeURIComponent(`ratelimit:${key}`)

  try {
    // Use a sliding counter: INCR + EXPIRE via a pipeline
    const pipeline = [
      ['INCR', encodedKey],
      ['EXPIRE', encodedKey, windowSeconds, 'NX'], // only set TTL on first increment
    ]

    const pipelineRes = await fetch(`${url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
    })

    if (!pipelineRes.ok) {
      // Redis request failed — degrade gracefully
      console.warn('[rateLimit] Upstash request failed, using in-memory fallback')
      return memoryRateLimit(key, options)
    }

    const results = await pipelineRes.json() as Array<{ result: number }>
    const count = results[0]?.result ?? 1

    if (count > options.limit) {
      // Get remaining TTL for Retry-After header
      const ttlRes = await fetch(`${url}/ttl/${encodedKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const ttlData = ttlRes.ok ? (await ttlRes.json() as { result: number }) : null
      const retryAfter = ttlData?.result && ttlData.result > 0 ? ttlData.result : windowSeconds

      return { limited: true, retryAfter }
    }

    return { limited: false, retryAfter: 0 }
  } catch (err) {
    console.warn('[rateLimit] Upstash error, using in-memory fallback:', err)
    return memoryRateLimit(key, options)
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns a 429 NextResponse if the IP has exceeded the rate limit.
 * Returns null if the request is allowed.
 *
 * Automatically uses Upstash Redis when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set; otherwise falls back to in-memory.
 *
 * Usage:
 *   const limited = await rateLimit(req, { limit: 5, windowMs: 60_000 })
 *   if (limited) return limited
 */
export async function rateLimit(req: NextRequest, options: RateLimitOptions): Promise<NextResponse | null> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const key = `${ip}:${req.nextUrl.pathname}`

  const { limited, retryAfter } = await upstashRateLimit(key, options)

  if (limited) {
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
