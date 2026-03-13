import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole } from '@prisma/client'

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'dev-secret-please-change'
)

export interface SessionUser {
  id: string
  email: string
  name: string
  role: UserRole
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function getSession(req: NextRequest): Promise<SessionUser | null> {
  const token = req.cookies.get('session')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireSession(req: NextRequest): Promise<SessionUser> {
  const session = await getSession(req)
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireRole(req: NextRequest, ...roles: UserRole[]): Promise<SessionUser> {
  const session = await requireSession(req)
  if (!roles.includes(session.role)) throw new Error('Forbidden')
  return session
}

export async function getUserFromDb(email: string) {
  return prisma.user.findUnique({ where: { email } })
}
