import { cookies } from 'next/headers'
import { verifyToken, SessionUser } from './auth'

export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireServerSession(): Promise<SessionUser> {
  const session = await getServerSession()
  if (!session) throw new Error('Unauthorized')
  return session
}
