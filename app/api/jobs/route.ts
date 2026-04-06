import { JobStatus, UrgencyLevel } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { jobInputSchema } from '@/lib/validators'
import { z } from 'zod'

function parseBudget(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return null
  const parsed = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function parsePreferredDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const area = searchParams.get('area')
  const status = (searchParams.get('status') as JobStatus | null) || JobStatus.OPEN

  const jobs = await prisma.job.findMany({
    where: {
      status,
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
    const data = jobInputSchema.parse(await req.json())

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    const job = await prisma.job.create({
      data: {
        customerId: session.id,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        area: data.area,
        budget: parseBudget(data.budget),
        preferredDate: parsePreferredDate(data.preferredDate ?? null),
        urgency: data.urgency || UrgencyLevel.MEDIUM,
        status: JobStatus.OPEN,
        expiresAt,
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid request' }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (error instanceof Error && error.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
