import { prisma } from '@/lib/prisma'

export type NotificationType =
  | 'new_application'
  | 'selected'
  | 'verification_approved'
  | 'verification_rejected'
  | 'new_message'
  | 'job_alert'

export async function createNotification(params: {
  userId: string
  type: NotificationType
  title: string
  body: string
  link?: string
}) {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        body: params.body,
        link: params.link ?? null,
      },
    })
  } catch {
    // Notifications are non-critical — never throw
  }
}
