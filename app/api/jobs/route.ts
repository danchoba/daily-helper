import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession, requireRole } from '@/lib/auth'
import { JobStatus, UrgencyLevel } from '@prisma/client'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const area = searchParams.get('area')
  const status = searchParams.get('status') || 'OPEN'

  const jobs = await prisma.job.findMany({
    where: {
      status: status as JobStatus,
      ...(category ? { category: { slug: category } } : {}),
      ...(area ? { area: { contains: area, mode: 'insensitive' } } : {}),
    },
    include: {
      category: true,
      customer: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(jobs)
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireRole(req, 'CUSTOMER')
    const body = await req.json()
    const { title, description, categoryId, area, budget, preferredDate, urgency } = body
    if (!title || !description || !categoryId || !area) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const job = await prisma.job.create({
      data: {
        customerId: session.id,
        title: title.trim(),
        description: description.trim(),
        categoryId,
        area: area.trim(),
        budget: budget ? parseFloat(budget) : null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        urgency: (urgency as UrgencyLevel) || UrgencyLevel.MEDIUM,
        status: JobStatus.OPEN,
      }
    })
    return NextResponse.json(job, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
