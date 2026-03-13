import { NextRequest, NextResponse } from 'next/server'
import { getUserFromDb, verifyPassword, createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const user = await getUserFromDb(email.toLowerCase().trim())
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
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
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
