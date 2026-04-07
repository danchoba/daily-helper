import { NextRequest, NextResponse } from 'next/server'
import { requireServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  try {
    const session = await requireServerSession()

    const unreadCount = await prisma.message.count({
      where: {
        readAt: null,
        senderId: { not: session.id },
        conversation: {
          OR: [
            { job: { customerId: session.id } },
            { workerId: session.id },
          ],
        },
      },
    })

    return NextResponse.json({ unreadCount })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
