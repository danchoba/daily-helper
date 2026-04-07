import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireRole(req, 'ADMIN')
    const { resolution, status } = await req.json()

    if (!resolution?.trim()) {
      return NextResponse.json({ error: 'Resolution note is required' }, { status: 400 })
    }
    if (status !== 'RESOLVED' && status !== 'CLOSED') {
      return NextResponse.json({ error: 'Status must be RESOLVED or CLOSED' }, { status: 400 })
    }

    const dispute = await prisma.dispute.findUnique({ where: { id: params.id } })
    if (!dispute) return NextResponse.json({ error: 'Dispute not found' }, { status: 404 })
    if (dispute.status !== 'OPEN') {
      return NextResponse.json({ error: 'Dispute is already resolved' }, { status: 400 })
    }

    const updated = await prisma.dispute.update({
      where: { id: params.id },
      data: {
        status,
        resolution: resolution.trim(),
        resolvedById: session.id,
        resolvedAt: new Date(),
      },
    })

    return NextResponse.json(updated)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
