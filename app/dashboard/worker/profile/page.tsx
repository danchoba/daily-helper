import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { WorkerProfileForm } from './WorkerProfileForm'

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
        <Link href="/dashboard/worker" className="subtle-link inline-flex items-center gap-2">Back to dashboard</Link>
        <h1 className="page-title mt-3 mb-6">My profile</h1>
        <WorkerProfileForm profile={profile} phoneNumber={user?.phoneNumber || ''} serviceOptions={SERVICE_OPTIONS} />
    </div>
  )
}
