import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'
import { VERIFICATION_FEE } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'worker') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { paymentReference, idDocumentUrl } = await req.json()

  const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: session.user.id } })
  if (!workerProfile) return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 })

  const existing = await prisma.verificationRequest.findUnique({ where: { workerId: workerProfile.id } })
  if (existing) {
    return NextResponse.json({ error: 'Verification request already submitted' }, { status: 400 })
  }

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      type: 'verification_fee',
      amount: VERIFICATION_FEE,
      currency: 'BWP',
      reference: paymentReference,
      status: 'pending',
    },
  })

  const verification = await prisma.verificationRequest.create({
    data: {
      workerId: workerProfile.id,
      idDocumentUrl,
      paymentReference,
      paymentId: payment.id,
      status: 'pending',
    },
  })

  await prisma.workerProfile.update({
    where: { id: workerProfile.id },
    data: { verificationStatus: 'pending' },
  })

  return NextResponse.json({ verification, payment }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.role === 'admin') {
    const requests = await prisma.verificationRequest.findMany({
      include: {
        worker: { include: { user: { select: { id: true, name: true, email: true } } } },
        payment: true,
      },
      orderBy: { submittedAt: 'desc' },
    })
    return NextResponse.json(requests)
  }

  const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: session.user.id } })
  if (!workerProfile) return NextResponse.json(null)

  const request = await prisma.verificationRequest.findUnique({
    where: { workerId: workerProfile.id },
    include: { payment: true },
  })

  return NextResponse.json(request)
}
