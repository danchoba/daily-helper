import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, phoneNumber } = await req.json()
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }
    if (!['CUSTOMER', 'WORKER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role as UserRole,
        phoneNumber: phoneNumber?.trim() || null,
        ...(role === 'WORKER' ? { workerProfile: { create: {} } } : {}),
        ...(role === 'CUSTOMER' ? { customerProfile: { create: {} } } : {}),
      }
    })
    const token = await createToken({ id: user.id, email: user.email, name: user.name, role: user.role })
    const res = NextResponse.json({ success: true, role: user.role })
    res.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
