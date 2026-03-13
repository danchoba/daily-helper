import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { ApplicationStatus } from '@prisma/client'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'WORKER')
    const { message } = await req.json()
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }
    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    if (job.status !== 'OPEN') {
      return NextResponse.json({ error: 'Job is not accepting applications' }, { status: 400 })
    }
    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_workerId: { jobId: params.id, workerId: session.id } }
    })
    if (existing) {
      return NextResponse.json({ error: 'Already applied to this job' }, { status: 409 })
    }
    const application = await prisma.jobApplication.create({
      data: { jobId: params.id, workerId: session.id, message: message.trim(), status: ApplicationStatus.PENDING }
    })
    return NextResponse.json(application, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Only workers can apply' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
