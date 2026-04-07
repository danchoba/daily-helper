import { NextRequest, NextResponse } from 'next/server'
import { requireServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireServerSession()
    if (session.role !== 'CUSTOMER' && session.role !== 'WORKER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { reason } = await req.json()
    if (!reason?.trim()) {
      return NextResponse.json({ error: 'Reason is required' }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: { applications: { where: { status: 'SELECTED' }, select: { workerId: true } } },
    })

    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    // Only the customer who posted or the selected worker can raise a dispute
    const isCustomer = job.customerId === session.id
    const isSelectedWorker = job.applications.some(a => a.workerId === session.id)
    if (!isCustomer && !isSelectedWorker) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (job.status !== 'IN_PROGRESS' && job.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Disputes can only be raised on in-progress or completed jobs' }, { status: 400 })
    }

    const existing = await prisma.dispute.findUnique({ where: { jobId: params.id } })
    if (existing) {
      return NextResponse.json({ error: 'A dispute already exists for this job' }, { status: 409 })
    }

    const dispute = await prisma.dispute.create({
      data: { jobId: params.id, raisedById: session.id, reason: reason.trim() },
    })

    return NextResponse.json(dispute, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
