import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireRole(req, 'CUSTOMER')
    const { id: jobId } = await params
    const { workerId, rating, comment } = await req.json()
    if (!workerId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'workerId and rating (1-5) required' }, { status: 400 })
    }
    const job = await prisma.job.findUnique({ where: { id: jobId } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (job.customerId !== session.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (job.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Job must be completed first' }, { status: 400 })
    }
    const existing = await prisma.review.findUnique({ where: { jobId } })
    if (existing) return NextResponse.json({ error: 'Already reviewed' }, { status: 409 })

    const review = await prisma.review.create({
      data: { jobId, customerId: session.id, workerId, rating, comment: comment?.trim() || null }
    })

    // Recalculate average rating and increment jobs completed
    const reviews = await prisma.review.findMany({ where: { workerId }, select: { rating: true } })
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await prisma.workerProfile.update({
      where: { userId: workerId },
      data: {
        averageRating: Math.round(avg * 10) / 10,
        jobsCompleted: { increment: 1 },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err instanceof Error && err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
