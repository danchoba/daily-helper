import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'CUSTOMER')
    const { applicationId } = await req.json()
    if (!applicationId) return NextResponse.json({ error: 'applicationId required' }, { status: 400 })

    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (job.customerId !== session.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (job.status !== 'OPEN') return NextResponse.json({ error: 'Job is not open' }, { status: 400 })

    const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } })
    if (!application || application.jobId !== params.id) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Reject all other pending applications
    await prisma.jobApplication.updateMany({
      where: { jobId: params.id, status: 'PENDING', id: { not: applicationId } },
      data: { status: 'REJECTED' }
    })
    // Select this one
    await prisma.jobApplication.update({ where: { id: applicationId }, data: { status: 'SELECTED' } })
    // Update job status
    await prisma.job.update({ where: { id: params.id }, data: { status: 'IN_PROGRESS' } })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
