import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { WorkerProfileForm } from './WorkerProfileForm'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

const SERVICE_OPTIONS = ['Cleaning', 'Garden & Yard', 'Moving & Lifting', 'Plumbing', 'Painting', 'Errands & Queue', 'Electrical', 'Other']

export default async function WorkerProfilePage() {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')

  const [profile, user] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId: session.id } }),
    prisma.user.findUnique({ where: { id: session.id }, select: { phoneNumber: true } }),
  ])

  return (
    <div className="max-w-3xl">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard/worker' },
          { label: 'My Profile' },
        ]} />
        <h1 className="page-title mb-6">My profile</h1>
        <WorkerProfileForm profile={profile} phoneNumber={user?.phoneNumber || ''} serviceOptions={SERVICE_OPTIONS} />
    </div>
  )
}
