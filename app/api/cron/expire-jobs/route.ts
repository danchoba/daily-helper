import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/cron/expire-jobs
 *
 * Closes all OPEN jobs whose expiresAt has passed.
 * Also handles legacy jobs without expiresAt by closing any OPEN job
 * that is older than JOB_EXPIRY_DAYS (default 30 days).
 *
 * Secured by a shared CRON_SECRET environment variable.
 * Call this route on a schedule (e.g. daily) using Vercel Cron,
 * GitHub Actions, or any external scheduler.
 *
 * Vercel Cron setup (vercel.json):
 * {
 *   "crons": [{ "path": "/api/cron/expire-jobs", "schedule": "0 2 * * *" }]
 * }
 *
 * The Vercel Cron token is automatically injected via the Authorization header
 * when running on Vercel. For manual/external calls, set:
 *   Authorization: Bearer <CRON_SECRET>
 */

const JOB_EXPIRY_DAYS = 30

export async function POST(req: NextRequest) {
  // Verify caller is authorised
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const now = new Date()
    const legacyExpiryCutoff = new Date(now.getTime() - JOB_EXPIRY_DAYS * 24 * 60 * 60 * 1000)

    const result = await prisma.job.updateMany({
      where: {
        status: 'OPEN',
        OR: [
          // Jobs with an explicit expiry date that has passed
          { expiresAt: { lt: now, not: null } },
          // Legacy jobs (no expiresAt set) older than JOB_EXPIRY_DAYS
          { expiresAt: null, createdAt: { lt: legacyExpiryCutoff } },
        ],
      },
      data: {
        status: 'CLOSED',
      },
    })

    console.log(`[expire-jobs] Closed ${result.count} expired job(s) at ${now.toISOString()}`)

    return NextResponse.json({
      success: true,
      closedCount: result.count,
      ranAt: now.toISOString(),
    })
  } catch (error) {
    console.error('[expire-jobs] Failed to expire jobs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Also support GET so Vercel Cron can hit it (Vercel sends GET for cron jobs)
export async function GET(req: NextRequest) {
  return POST(req)
}
