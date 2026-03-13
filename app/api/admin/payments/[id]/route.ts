import { PaymentStatus, PaymentType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { adminPaymentActionSchema } from '@/lib/validators'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(req, 'ADMIN')
    const data = adminPaymentActionSchema.parse(await req.json())

    const payment = await prisma.payment.findUnique({ where: { id: params.id } })
    if (!payment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const newStatus = data.action === 'approve' ? PaymentStatus.APPROVED : PaymentStatus.REJECTED

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: params.id },
        data: { status: newStatus, reviewedAt: new Date() },
      })

      if (data.action !== 'approve' || payment.type !== PaymentType.CONNECTION_FEE) {
        return
      }

      if (!data.jobId || !data.workerId) {
        throw new Error('Connection fee approvals require jobId and workerId')
      }

      const job = await tx.job.findUnique({ where: { id: data.jobId } })
      if (!job || job.customerId !== payment.userId) {
        throw new Error('Invalid job for this payment')
      }

      const application = await tx.jobApplication.findFirst({
        where: { jobId: data.jobId, workerId: data.workerId },
      })
      if (!application) {
        throw new Error('Worker has not applied to this job')
      }

      const existingUnlock = await tx.contactUnlock.findFirst({ where: { paymentId: params.id } })
      if (!existingUnlock) {
        await tx.contactUnlock.create({
          data: {
            jobId: data.jobId,
            customerId: payment.userId,
            workerId: data.workerId,
            paymentId: params.id,
          },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid request' }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error instanceof Error && error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (error instanceof Error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
