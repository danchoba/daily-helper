import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { DashboardFrame } from '@/components/layout/DashboardFrame'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'ADMIN') redirect('/')
  return <DashboardFrame user={session}>{children}</DashboardFrame>
}
