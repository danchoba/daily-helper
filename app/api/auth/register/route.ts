import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['customer', 'worker']),
  phoneNumber: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        role: data.role,
        phoneNumber: data.phoneNumber,
      },
    })

    if (data.role === 'worker') {
      await prisma.workerProfile.create({ data: { userId: user.id } })
    } else {
      await prisma.customerProfile.create({ data: { userId: user.id } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
