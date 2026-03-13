import { NextRequest, NextResponse } from 'next/server'
import { createToken, getUserFromDb, verifyPassword } from '@/lib/auth'
import { signInSchema } from '@/lib/validators'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const data = signInSchema.parse(await req.json())
    const user = await getUserFromDb(data.email.toLowerCase())

    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

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
