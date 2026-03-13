import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { DashboardFrame } from '@/components/layout/DashboardFrame'

export default async function WorkerDashLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'WORKER') redirect(session.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/customer')
  return <DashboardFrame user={session}>{children}</DashboardFrame>
}
