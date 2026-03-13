import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const profile = await prisma.workerProfile.findUnique({ where: { userId: session.id } })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    return NextResponse.json(profile)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const { bio, area, servicesOffered, profilePhotoUrl } = await req.json()
    const profile = await prisma.workerProfile.upsert({
      where: { userId: session.id },
      update: {
        ...(bio !== undefined && { bio: bio.trim() }),
        ...(area !== undefined && { area: area.trim() }),
        ...(servicesOffered !== undefined && { servicesOffered }),
        ...(profilePhotoUrl !== undefined && { profilePhotoUrl }),
      },
      create: { userId: session.id, bio, area, servicesOffered: servicesOffered || [] }
    })
    // Also update phone if provided
    return NextResponse.json(profile)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
