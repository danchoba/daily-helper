import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { status, notes } = await req.json()

  const verification = await prisma.verificationRequest.findUnique({
    where: { id: params.id },
    include: { worker: true, payment: true },
  })

  if (!verification) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.verificationRequest.update({
    where: { id: params.id },
    data: { status, reviewedAt: new Date(), reviewedBy: session.user.id },
  })

  await prisma.workerProfile.update({
    where: { id: verification.workerId },
    data: {
      verificationStatus: status,
      trustedBadge: status === 'approved',
    },
  })

  if (verification.paymentId) {
    await prisma.payment.update({
      where: { id: verification.paymentId },
      data: { status: status === 'approved' ? 'approved' : 'rejected', notes, reviewedAt: new Date() },
    })
  }

  return NextResponse.json({ success: true })
}
