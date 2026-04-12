import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reportSchema = z.object({
  reason: z.string().trim().min(5).max(500),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole(req, 'WORKER')
    const { id: jobId } = await params
    const { reason } = reportSchema.parse(await req.json())

    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })

    const existing = await prisma.jobReport.findFirst({
      where: { jobId, reportedById: session.id },
    })
    if (existing) return NextResponse.json({ error: 'You have already reported this job' }, { status: 409 })

    await prisma.jobReport.create({
      data: { jobId, reportedById: session.id, reason },
    })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 })
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
