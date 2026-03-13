import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'
import { CONNECTION_FEE } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { jobId, workerId, paymentReference } = await req.json()

  if (!jobId || !workerId || !paymentReference) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify the worker was selected for this job
  const workerProfile = await prisma.workerProfile.findUnique({ where: { id: workerId } })
  if (!workerProfile) return NextResponse.json({ error: 'Worker not found' }, { status: 404 })

  const application = await prisma.jobApplication.findUnique({
    where: { jobId_workerId: { jobId, workerId } },
  })
  if (!application || application.status !== 'selected') {
    return NextResponse.json({ error: 'Worker was not selected for this job' }, { status: 400 })
  }

  // Check for existing unlock
  const existingUnlock = await prisma.contactUnlock.findUnique({
    where: { jobId_customerId_workerId: { jobId, customerId: session.user.id, workerId } },
  })
  if (existingUnlock) {
    return NextResponse.json({ error: 'Already submitted for this worker' }, { status: 400 })
  }

  // Create payment record (pending manual approval)
  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      type: 'connection_fee',
      amount: CONNECTION_FEE,
      currency: 'BWP',
      reference: paymentReference,
      status: 'pending',
    },
  })

  // Create unlock record linked to payment (not yet active)
  const unlock = await prisma.contactUnlock.create({
    data: {
      jobId,
      customerId: session.user.id,
      workerId,
      paymentId: payment.id,
    },
  })

  return NextResponse.json({ payment, unlock, message: 'Payment submitted for review. Contact will be unlocked once approved.' }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  const unlocks = await prisma.contactUnlock.findMany({
    where: {
      customerId: session.user.id,
      ...(jobId && { jobId }),
      payment: { status: 'approved' },
    },
    include: { worker: { include: { user: { select: { name: true, phoneNumber: true } } } } },
  })

  return NextResponse.json(unlocks)
}
