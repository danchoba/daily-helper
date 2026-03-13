import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { customer: true },
  })
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  if (job.customer.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (job.status !== 'in_progress') return NextResponse.json({ error: 'Job must be in progress' }, { status: 400 })

  // Mark selected worker as having completed a job
  const selectedApp = await prisma.jobApplication.findFirst({
    where: { jobId: params.id, status: 'selected' },
  })

  await prisma.job.update({ where: { id: params.id }, data: { status: 'completed' } })

  if (selectedApp) {
    await prisma.workerProfile.update({
      where: { id: selectedApp.workerId },
      data: { jobsCompleted: { increment: 1 } },
    })
  }

  return NextResponse.json({ success: true })
}
