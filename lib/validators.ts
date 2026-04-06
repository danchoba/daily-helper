import { JobStatus, UrgencyLevel } from '@prisma/client'
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export const signUpSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(72),
  phoneNumber: z.string().trim().max(30).optional().or(z.literal('')),
  role: z.enum(['CUSTOMER', 'WORKER']),
})

export const jobInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  categoryId: z.string().min(1),
  area: z.string().trim().min(2).max(120),
  budget: z.union([z.number(), z.string(), z.null()]).optional(),
  preferredDate: z.string().datetime().optional().or(z.string().date()).or(z.null()),
  urgency: z.nativeEnum(UrgencyLevel).optional(),
})

export const jobPatchSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  categoryId: z.string().min(1).optional(),
  area: z.string().trim().min(2).max(120).optional(),
  budget: z.union([z.number(), z.string(), z.null()]).optional(),
  preferredDate: z.string().datetime().optional().or(z.string().date()).or(z.null()).optional(),
  urgency: z.nativeEnum(UrgencyLevel).optional(),
  status: z.nativeEnum(JobStatus).optional(),
})

export const workerProfileSchema = z.object({
  bio: z.string().trim().max(500).optional(),
  area: z.string().trim().max(120).optional(),
  profilePhotoUrl: z.string().url().optional().or(z.literal('')).or(z.null()),
  servicesOffered: z.array(z.string().trim().min(1).max(60)).max(12).optional(),
  isAvailable: z.boolean().optional(),
})

export const adminActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
})
