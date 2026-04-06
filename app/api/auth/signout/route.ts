import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/', req.nextUrl.origin))
  res.cookies.delete('session')
  return res
}
