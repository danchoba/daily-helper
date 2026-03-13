import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { UserRole } from '@prisma/client'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

function getJwtSecret() {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is required')
  }
  return new TextEncoder().encode(secret)
}

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
    .sign(getJwtSecret())
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
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
