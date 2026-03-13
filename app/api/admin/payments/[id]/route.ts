import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { PaymentStatus, PaymentType } from '@prisma/client'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'ADMIN')
    const { action, jobId, workerId } = await req.json()

    const payment = await prisma.payment.findUnique({ where: { id: params.id } })
    if (!payment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const newStatus = action === 'approve' ? PaymentStatus.APPROVED : PaymentStatus.REJECTED

    await prisma.payment.update({
      where: { id: params.id },
      data: { status: newStatus, reviewedAt: new Date() }
    })

    // If connection fee approval, create contact unlock record
    if (action === 'approve' && payment.type === PaymentType.CONNECTION_FEE && jobId && workerId) {
      const existing = await prisma.contactUnlock.findFirst({
        where: { paymentId: params.id }
      })
      if (!existing) {
        await prisma.contactUnlock.create({
          data: {
            jobId,
            customerId: payment.userId,
            workerId,
            paymentId: params.id,
          }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
