import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'

type CookieSetter = (name: string, value: string, options: Record<string, unknown>) => void

export function createSupabaseServerClient(req: NextRequest, setCookie: CookieSetter) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            setCookie(name, value, options as Record<string, unknown>)
          )
        },
      },
    }
  )
}
