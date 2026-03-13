import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { PaymentType, PaymentStatus, VerificationStatus } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const { paymentReference, idDocumentUrl } = await req.json()
    if (!paymentReference) {
      return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 })
    }

    // Check for existing pending/approved request
    const existing = await prisma.verificationRequest.findFirst({
      where: { workerId: session.id, status: { in: [VerificationStatus.PENDING, VerificationStatus.APPROVED] } }
    })
    if (existing) {
      return NextResponse.json({ error: 'You already have a pending or approved verification request' }, { status: 409 })
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: session.id,
        type: PaymentType.VERIFICATION_FEE,
        amount: 50,
        currency: 'BWP',
        reference: paymentReference.trim(),
        status: PaymentStatus.PENDING,
      }
    })

    // Create verification request
    const verReq = await prisma.verificationRequest.create({
      data: {
        workerId: session.id,
        paymentReference: paymentReference.trim(),
        paymentId: payment.id,
        idDocumentUrl: idDocumentUrl || null,
        status: VerificationStatus.PENDING,
      }
    })

    // Update worker profile verification status
    await prisma.workerProfile.update({
      where: { userId: session.id },
      data: { verificationStatus: VerificationStatus.PENDING }
    })

    return NextResponse.json(verReq, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const request = await prisma.verificationRequest.findFirst({
      where: { workerId: session.id },
      orderBy: { submittedAt: 'desc' },
      include: { payment: true }
    })
    return NextResponse.json(request || null)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
