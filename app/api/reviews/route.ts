import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { jobId, workerId, rating, comment } = await req.json()

  if (!jobId || !workerId || !rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const existing = await prisma.review.findUnique({
    where: { jobId_customerId: { jobId, customerId: session.user.id } },
  })
  if (existing) return NextResponse.json({ error: 'Already reviewed' }, { status: 400 })

  const review = await prisma.review.create({
    data: { jobId, customerId: session.user.id, workerId, rating, comment },
  })

  // Update worker average rating
  const reviews = await prisma.review.findMany({ where: { workerId } })
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const workerProfile = await prisma.workerProfile.findFirst({ where: { user: { id: workerId } } })
  if (workerProfile) {
    await prisma.workerProfile.update({
      where: { id: workerProfile.id },
      data: { averageRating: avg },
    })
  }

  return NextResponse.json(review, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const reviews = await prisma.review.findMany({
    where: { customerId: session.user.id },
    include: { job: { include: { category: true } }, worker: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(reviews)
}
