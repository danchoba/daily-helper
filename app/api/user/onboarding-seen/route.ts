import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/user/onboarding-seen
 *
 * Marks the authenticated user's onboarding as completed.
 * Safe to call multiple times — idempotent.
 */
export async function POST(req: NextRequest) {
  try {
    // Any authenticated role can mark their own onboarding seen
    const session =
      (await requireRole(req, 'WORKER').catch(() => null)) ??
      (await requireRole(req, 'CUSTOMER').catch(() => null)) ??
      (await requireRole(req, 'ADMIN').catch(() => null))

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.user.update({
      where: { id: session.id },
      data: { hasSeenOnboarding: true },
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
