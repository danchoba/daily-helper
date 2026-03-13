import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { PaymentType, PaymentStatus } from '@prisma/client'

// POST: Initiate connection fee payment (manual MVP flow)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'CUSTOMER')
    const { workerId, paymentReference } = await req.json()
    if (!workerId || !paymentReference) {
      return NextResponse.json({ error: 'workerId and paymentReference required' }, { status: 400 })
    }
    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (job.customerId !== session.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Check if already unlocked
    const existing = await prisma.contactUnlock.findFirst({
      where: { jobId: params.id, customerId: session.id, workerId }
    })
    if (existing) return NextResponse.json({ error: 'Already submitted' }, { status: 409 })

    // Create payment record (pending - admin must approve manually)
    const payment = await prisma.payment.create({
      data: {
        userId: session.id,
        type: PaymentType.CONNECTION_FEE,
        amount: 25,
        currency: 'BWP',
        reference: paymentReference.trim(),
        status: PaymentStatus.PENDING,
      }
    })

    // Store pending unlock with payment reference
    // (actual unlock happens when admin approves payment)
    return NextResponse.json({ success: true, paymentId: payment.id, message: 'Payment reference submitted. Admin will verify and unlock the contact within 24 hours.' })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// GET: Check unlock status
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'CUSTOMER')
    const { searchParams } = new URL(req.url)
    const workerId = searchParams.get('workerId')

    const unlock = await prisma.contactUnlock.findFirst({
      where: { jobId: params.id, customerId: session.id, ...(workerId ? { workerId } : {}) },
      include: { worker: { select: { name: true, phoneNumber: true } } }
    })

    if (!unlock) return NextResponse.json({ unlocked: false })
    return NextResponse.json({ unlocked: true, workerName: unlock.worker.name, phoneNumber: unlock.worker.phoneNumber })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
