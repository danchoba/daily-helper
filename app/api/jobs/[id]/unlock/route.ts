import { PaymentStatus, PaymentType } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlockRequestSchema } from '@/lib/validators'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'CUSTOMER')
    const data = unlockRequestSchema.parse(await req.json())

    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (job.customerId !== session.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const application = await prisma.jobApplication.findFirst({
      where: { jobId: params.id, workerId: data.workerId },
    })
    if (!application) {
      return NextResponse.json({ error: 'Worker is not linked to this job' }, { status: 400 })
    }

    const existingUnlock = await prisma.contactUnlock.findFirst({
      where: { jobId: params.id, customerId: session.id, workerId: data.workerId },
    })
    if (existingUnlock) return NextResponse.json({ error: 'Already submitted' }, { status: 409 })

    const payment = await prisma.payment.create({
      data: {
        userId: session.id,
        type: PaymentType.CONNECTION_FEE,
        amount: 25,
        currency: 'BWP',
        reference: data.paymentReference,
        status: PaymentStatus.PENDING,
      },
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message: 'Payment reference submitted. Admin will verify and unlock the contact within 24 hours.',
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid request' }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error instanceof Error && error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'CUSTOMER')
    const { searchParams } = new URL(req.url)
    const workerId = searchParams.get('workerId')

    const unlock = await prisma.contactUnlock.findFirst({
      where: { jobId: params.id, customerId: session.id, ...(workerId ? { workerId } : {}) },
      include: { worker: { select: { name: true, phoneNumber: true } } },
    })

    if (!unlock) return NextResponse.json({ unlocked: false })
    return NextResponse.json({ unlocked: true, workerName: unlock.worker.name, phoneNumber: unlock.worker.phoneNumber })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
