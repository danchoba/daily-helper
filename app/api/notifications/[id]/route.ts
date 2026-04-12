import { NextRequest, NextResponse } from 'next/server'
import { requireServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireServerSession()
    const { id } = await params
    await prisma.notification.updateMany({
      where: { id, userId: session.id },
      data: { readAt: new Date() },
    })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
