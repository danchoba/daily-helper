import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const worker = await prisma.workerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, createdAt: true } },
    },
  })

  if (!worker) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(worker)
}
