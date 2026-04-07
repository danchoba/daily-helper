import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get('role') ?? 'LOGIN'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const redirectTo = `${appUrl}/api/auth/callback`

  const pendingCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = []

  const supabase = createSupabaseServerClient(req, (name, value, options) => {
    pendingCookies.push({ name, value, options })
  })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  })

  if (error || !data.url) {
    return NextResponse.redirect(`${appUrl}/login?error=oauth`)
  }

  const res = NextResponse.redirect(data.url)

  // Forward Supabase PKCE cookies (needed for exchangeCodeForSession in callback)
  pendingCookies.forEach(({ name, value, options }) => {
    res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2])
  })

  // Carry the role through the OAuth round-trip
  res.cookies.set('oauth_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 300,
    path: '/',
  })

  return res
}
