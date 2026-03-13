import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionUser } from '@/lib/session'

export async function GET() {
  const user = await getSessionUser()
  if (!user || user.role !== 'worker') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.workerProfile.findUnique({ where: { userId: user.id } })
  return NextResponse.json({ profile })
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser()
  if (!user || user.role !== 'worker') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bio, area, servicesOffered, profilePhotoUrl } = await req.json()

  const profile = await prisma.workerProfile.update({
    where: { userId: user.id },
    data: {
      bio: bio?.trim() || undefined,
      area: area?.trim() || undefined,
      servicesOffered: Array.isArray(servicesOffered) ? servicesOffered : undefined,
      profilePhotoUrl: profilePhotoUrl?.trim() || undefined,
    },
  })

  return NextResponse.json({ success: true, profile })
}
