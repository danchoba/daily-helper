import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, email: true, role: true, phoneNumber: true, createdAt: true,
      workerProfile: { select: { trustedBadge: true, verificationStatus: true, jobsCompleted: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}
