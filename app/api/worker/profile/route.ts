import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { workerProfileSchema } from '@/lib/validators'

export async function GET(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const profile = await prisma.workerProfile.findUnique({ where: { userId: session.id } })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    return NextResponse.json(profile)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireRole(req, 'WORKER')
    const data = workerProfileSchema.parse(await req.json())

    const profile = await prisma.workerProfile.upsert({
      where: { userId: session.id },
      update: {
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.area !== undefined && { area: data.area }),
        ...(data.servicesOffered !== undefined && { servicesOffered: data.servicesOffered }),
        ...(data.profilePhotoUrl !== undefined && { profilePhotoUrl: data.profilePhotoUrl || null }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
      },
      create: {
        userId: session.id,
        bio: data.bio || null,
        area: data.area || null,
        servicesOffered: data.servicesOffered || [],
        profilePhotoUrl: data.profilePhotoUrl || null,
        isAvailable: data.isAvailable ?? true,
      },
    })

    return NextResponse.json(profile)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid request' }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
