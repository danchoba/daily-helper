import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { WorkerProfileForm } from './WorkerProfileForm'

const SERVICE_OPTIONS = ['Cleaning', 'Garden & Yard', 'Moving & Lifting', 'Plumbing', 'Painting', 'Errands & Queue', 'Electrical', 'Other']

export default async function WorkerProfilePage() {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')
  const [profile, user] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId: session.id } }),
    prisma.user.findUnique({ where: { id: session.id }, select: { phoneNumber: true } })
  ])
  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard/worker" className="text-earth-500 text-sm">← Dashboard</Link>
        <h1 className="page-title mt-2 mb-6">My Profile</h1>
        <WorkerProfileForm profile={profile} phoneNumber={user?.phoneNumber || ''} serviceOptions={SERVICE_OPTIONS} />
      </div>
    </div>
  )
}
