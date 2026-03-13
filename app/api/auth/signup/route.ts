import { UserRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createToken, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validators'

export async function POST(req: NextRequest) {
  try {
    const data = signUpSchema.parse(await req.json())
    const normalizedEmail = data.email.toLowerCase()

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await hashPassword(data.password)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        passwordHash,
        role: data.role as UserRole,
        phoneNumber: data.phoneNumber?.trim() || null,
        ...(data.role === 'WORKER' ? { workerProfile: { create: {} } } : {}),
        ...(data.role === 'CUSTOMER' ? { customerProfile: { create: {} } } : {}),
      },
    })

    const token = await createToken({ id: user.id, email: user.email, name: user.name, role: user.role })
    const res = NextResponse.json({ success: true, role: user.role })

    res.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
