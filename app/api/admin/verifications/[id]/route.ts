import { VerificationStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adminActionSchema } from '@/lib/validators'
import { sendVerificationApprovedEmail, sendVerificationRejectedEmail } from '@/lib/email'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'ADMIN')
    const data = adminActionSchema.parse(await req.json())

    const verificationRequest = await prisma.verificationRequest.findUnique({
      where: { id: params.id },
      include: { worker: { select: { email: true, name: true } } },
    })

    if (!verificationRequest) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const newStatus = data.action === 'approve' ? VerificationStatus.APPROVED : VerificationStatus.REJECTED

    await prisma.$transaction(async (tx) => {
      await tx.verificationRequest.update({
        where: { id: params.id },
        data: { status: newStatus, reviewedAt: new Date(), reviewedBy: session.id },
      })

      await tx.workerProfile.update({
        where: { userId: verificationRequest.workerId },
        data: {
          verificationStatus: newStatus,
          trustedBadge: data.action === 'approve',
        },
      })
    })

    const { email, name } = verificationRequest.worker
    if (data.action === 'approve') {
      await sendVerificationApprovedEmail({ workerEmail: email, workerName: name })
    } else {
      await sendVerificationRejectedEmail({ workerEmail: email, workerName: name })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid request' }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error instanceof Error && error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
