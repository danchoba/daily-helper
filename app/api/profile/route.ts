import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      workerProfile: true,
      customerProfile: true,
    },
    omit: { passwordHash: true },
  })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  if (session.user.role === 'worker') {
    const { bio, area, servicesOffered, profilePhotoUrl } = body
    await prisma.workerProfile.update({
      where: { userId: session.user.id },
      data: { bio, area, servicesOffered, profilePhotoUrl },
    })
  } else if (session.user.role === 'customer') {
    const { defaultArea } = body
    await prisma.customerProfile.update({
      where: { userId: session.user.id },
      data: { defaultArea },
    })
  }

  // Update user name/phone if provided
  if (body.name || body.phoneNumber !== undefined) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.phoneNumber !== undefined && { phoneNumber: body.phoneNumber }),
      },
    })
  }

  return NextResponse.json({ success: true })
}
