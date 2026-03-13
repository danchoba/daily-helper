import { NextRequest, NextResponse } from 'next/server'
import { signIn, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const user = await signIn(email.trim(), password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    await createSession(user)
    return NextResponse.json({ success: true, user: { role: user.role } })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
