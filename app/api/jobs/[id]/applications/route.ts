import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { customer: true },
  })

  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (job.customer.userId !== session.user.id && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const applications = await prisma.jobApplication.findMany({
    where: { jobId: params.id },
    include: {
      worker: {
        include: { user: { select: { id: true, name: true, phoneNumber: true } } },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Hide phone unless unlocked
  const unlocks = await prisma.contactUnlock.findMany({
    where: { jobId: params.id, customerId: session.user.id },
  })
  const unlockedWorkerIds = new Set(unlocks.map(u => u.workerId))

  const sanitized = applications.map(app => ({
    ...app,
    worker: {
      ...app.worker,
      user: {
        ...app.worker.user,
        phoneNumber: unlockedWorkerIds.has(app.worker.id) ? app.worker.user.phoneNumber : null,
      },
    },
  }))

  return NextResponse.json(sanitized)
}
