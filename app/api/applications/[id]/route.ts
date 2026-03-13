import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  const application = await prisma.jobApplication.findUnique({
    where: { id: params.id },
    include: { job: { include: { customer: true } }, worker: true },
  })

  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isJobOwner = application.job.customer.userId === session.user.id
  const isWorker = application.worker.userId === session.user.id

  if (!isJobOwner && !isWorker && session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Workers can only withdraw
  if (isWorker && !isJobOwner && status !== 'withdrawn') {
    return NextResponse.json({ error: 'Workers can only withdraw applications' }, { status: 400 })
  }

  const updated = await prisma.jobApplication.update({
    where: { id: params.id },
    data: { status },
  })

  // If selected, update job status
  if (status === 'selected') {
    await prisma.job.update({ where: { id: application.jobId }, data: { status: 'in_progress' } })
  }

  return NextResponse.json(updated)
}
