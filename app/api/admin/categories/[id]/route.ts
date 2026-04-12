import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const patchSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  icon: z.string().trim().max(10).optional().or(z.literal('')),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, 'ADMIN')
    const { id } = await params
    const data = patchSchema.parse(await req.json())

    const updateData: { name?: string; slug?: string; icon?: string | null } = {}
    if (data.name) {
      updateData.name = data.name
      updateData.slug = toSlug(data.name)
    }
    if (data.icon !== undefined) updateData.icon = data.icon || null

    const category = await prisma.category.update({ where: { id }, data: updateData })
    return NextResponse.json(category)
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors[0]?.message }, { status: 400 })
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole(req, 'ADMIN')
    const { id } = await params

    const jobCount = await prisma.job.count({ where: { categoryId: id } })
    if (jobCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete — ${jobCount} job${jobCount === 1 ? '' : 's'} use this category` },
        { status: 409 },
      )
    }

    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (err.message === 'Forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (err.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
