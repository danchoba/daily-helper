import { NextRequest, NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'
import { createSupabaseServerClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'
import { createToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const code = req.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=oauth`)
  }

  const pendingCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = []

  const supabase = createSupabaseServerClient(req, (name, value, options) => {
    pendingCookies.push({ name, value, options })
  })

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user?.email) {
    console.error('[auth/callback] exchangeCodeForSession error:', error?.message, error?.status)
    return NextResponse.redirect(`${appUrl}/login?error=oauth`)
  }

  const email = data.user.email.toLowerCase()
  const googleName: string =
    data.user.user_metadata?.full_name ??
    data.user.user_metadata?.name ??
    email.split('@')[0]

  const role = req.cookies.get('oauth_role')?.value

  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    // New user — require a role from the signup flow
    if (!role || role === 'LOGIN') {
      return NextResponse.redirect(`${appUrl}/signup?error=no_account`)
    }

    const userRole = role as UserRole
    user = await prisma.user.create({
      data: {
        name: googleName,
        email,
        passwordHash: null,
        role: userRole,
        ...(userRole === 'WORKER' ? { workerProfile: { create: {} } } : {}),
        ...(userRole === 'CUSTOMER' ? { customerProfile: { create: {} } } : {}),
      },
    })
  }

  const token = await createToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  const dashboardPath =
    user.role === 'ADMIN'
      ? '/dashboard/admin'
      : user.role === 'WORKER'
        ? '/dashboard/worker'
        : '/dashboard/customer'

  const res = NextResponse.redirect(`${appUrl}${dashboardPath}`)

  // Forward any Supabase session cookies (PKCE cleanup etc.)
  pendingCookies.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2])
  })

  // Set our app session cookie
  res.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  // Clear the role cookie
  res.cookies.delete('oauth_role')

  return res
}
