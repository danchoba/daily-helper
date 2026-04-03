import { VerificationStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')

    const existing = await prisma.verificationRequest.findFirst({
      where: { workerId: session.id, status: { in: [VerificationStatus.PENDING, VerificationStatus.APPROVED] } },
    })
    if (existing) {
      return NextResponse.json({ error: 'You already have a pending or approved verification request' }, { status: 409 })
    }

    const body = await req.json().catch(() => ({}))
    const idDocumentUrl = typeof body.idDocumentUrl === 'string' && body.idDocumentUrl ? body.idDocumentUrl : null

    await prisma.$transaction(async (tx) => {
      await tx.verificationRequest.create({
        data: {
          workerId: session.id,
          idDocumentUrl,
          status: VerificationStatus.PENDING,
        },
      })

      await tx.workerProfile.update({
        where: { userId: session.id },
        data: { verificationStatus: VerificationStatus.PENDING },
      })
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error instanceof Error && error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const request = await prisma.verificationRequest.findFirst({
      where: { workerId: session.id },
      orderBy: { submittedAt: 'desc' },
    })
    return NextResponse.json(request || null)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
