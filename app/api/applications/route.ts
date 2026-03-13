import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'worker') {
    return NextResponse.json({ error: 'Only workers can apply' }, { status: 401 })
  }

  const { jobId, message } = await req.json()
  if (!jobId || !message?.trim()) {
    return NextResponse.json({ error: 'Job ID and message are required' }, { status: 400 })
  }

  const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: session.user.id } })
  if (!workerProfile) return NextResponse.json({ error: 'Worker profile not found' }, { status: 404 })

  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { customer: true } })
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  if (job.status !== 'open') return NextResponse.json({ error: 'Job is not accepting applications' }, { status: 400 })
  if (job.customer.userId === session.user.id) {
    return NextResponse.json({ error: 'Cannot apply to your own job' }, { status: 400 })
  }

  const existing = await prisma.jobApplication.findUnique({
    where: { jobId_workerId: { jobId, workerId: workerProfile.id } },
  })
  if (existing) return NextResponse.json({ error: 'Already applied' }, { status: 400 })

  const application = await prisma.jobApplication.create({
    data: { jobId, workerId: workerProfile.id, message },
  })

  return NextResponse.json(application, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: session.user.id } })
  if (!workerProfile) return NextResponse.json([])

  const applications = await prisma.jobApplication.findMany({
    where: { workerId: workerProfile.id },
    include: { job: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(applications)
}
