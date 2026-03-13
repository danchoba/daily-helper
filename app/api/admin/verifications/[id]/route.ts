import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { VerificationStatus } from '@prisma/client'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'ADMIN')
    const { action } = await req.json() // 'approve' | 'reject'

    const verReq = await prisma.verificationRequest.findUnique({
      where: { id: params.id },
      include: { payment: true }
    })
    if (!verReq) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const newStatus = action === 'approve' ? VerificationStatus.APPROVED : VerificationStatus.REJECTED

    await prisma.verificationRequest.update({
      where: { id: params.id },
      data: { status: newStatus, reviewedAt: new Date(), reviewedBy: session.id }
    })

    // Update worker profile
    await prisma.workerProfile.update({
      where: { userId: verReq.workerId },
      data: {
        verificationStatus: newStatus,
        trustedBadge: action === 'approve',
      }
    })

    // Approve payment too
    if (verReq.paymentId) {
      await prisma.payment.update({
        where: { id: verReq.paymentId },
        data: { status: action === 'approve' ? 'APPROVED' : 'REJECTED', reviewedAt: new Date() }
      })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
