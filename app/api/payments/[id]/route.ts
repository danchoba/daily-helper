import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin only' }, { status: 403 })
  }

  const { status, notes } = await req.json()

  const payment = await prisma.payment.update({
    where: { id: params.id },
    data: { status, notes, reviewedAt: new Date() },
  })

  // If connection fee approved, mark unlock as active
  if (status === 'approved' && payment.type === 'connection_fee') {
    await prisma.contactUnlock.updateMany({
      where: { paymentId: params.id },
      data: { unlockedAt: new Date() },
    })
  }

  return NextResponse.json(payment)
}
