import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  icon: z.string().trim().max(10).optional().or(z.literal('')),
})

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, 'ADMIN')
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { jobs: true } } },
    })
    return NextResponse.json(categories)
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, 'ADMIN')
    const data = categorySchema.parse(await req.json())
    const slug = toSlug(data.name)

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ error: 'A category with this name already exists' }, { status: 409 })

    const category = await prisma.category.create({
      data: { name: data.name, slug, icon: data.icon || null },
    })
    return NextResponse.json(category, { status: 201 })
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 })
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
