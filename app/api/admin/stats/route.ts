import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const [users, jobs, pendingVerifications, pendingPayments] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.verificationRequest.count({ where: { status: 'pending' } }),
    prisma.payment.count({ where: { status: 'pending' } }),
  ])

  return NextResponse.json({ users, jobs, pendingVerifications, pendingPayments })
}
