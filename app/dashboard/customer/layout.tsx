import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { DashboardFrame } from '@/components/layout/DashboardFrame'

export default async function CustomerDashLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'CUSTOMER') redirect(session.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/worker')

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { hasSeenOnboarding: true },
  })

  return (
    <DashboardFrame user={session} showOnboarding={!user?.hasSeenOnboarding}>
      {children}
    </DashboardFrame>
  )
}
