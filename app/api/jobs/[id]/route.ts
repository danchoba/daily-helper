import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { JobStatus } from '@prisma/client'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      customer: { select: { id: true, name: true } },
      applications: {
        include: {
          worker: {
            select: { id: true, name: true, workerProfile: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      review: true,
      _count: { select: { applications: true } }
    }
  })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(job)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isOwner = job.customerId === session.id
    const isAdmin = session.role === 'ADMIN'

    if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await req.json()
    const { title, description, categoryId, area, budget, preferredDate, urgency, status } = body

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(categoryId && { categoryId }),
        ...(area && { area: area.trim() }),
        ...(budget !== undefined && { budget: budget ? parseFloat(budget) : null }),
        ...(preferredDate !== undefined && { preferredDate: preferredDate ? new Date(preferredDate) : null }),
        ...(urgency && { urgency }),
        ...(status && { status: status as JobStatus }),
      }
    })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const job = await prisma.job.findUnique({ where: { id: params.id } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (job.customerId !== session.id && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await prisma.job.update({ where: { id: params.id }, data: { status: 'CANCELLED' } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
