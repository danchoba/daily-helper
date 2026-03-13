import { PaymentStatus, PaymentType, VerificationStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verificationRequestSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const data = verificationRequestSchema.parse(await req.json())

    const existing = await prisma.verificationRequest.findFirst({
      where: { workerId: session.id, status: { in: [VerificationStatus.PENDING, VerificationStatus.APPROVED] } },
    })
    if (existing) {
      return NextResponse.json({ error: 'You already have a pending or approved verification request' }, { status: 409 })
    }

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId: session.id,
          type: PaymentType.VERIFICATION_FEE,
          amount: 50,
          currency: 'BWP',
          reference: data.paymentReference,
          status: PaymentStatus.PENDING,
        },
      })

      const request = await tx.verificationRequest.create({
        data: {
          workerId: session.id,
          paymentReference: data.paymentReference,
          paymentId: payment.id,
          idDocumentUrl: data.idDocumentUrl || null,
          status: VerificationStatus.PENDING,
        },
      })

      await tx.workerProfile.update({
        where: { userId: session.id },
        data: { verificationStatus: VerificationStatus.PENDING },
      })

      return request
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid request' }, { status: 400 })
    }
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
      include: { payment: true },
    })
    return NextResponse.json(request || null)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
