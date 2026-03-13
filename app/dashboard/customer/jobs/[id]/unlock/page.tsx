import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { UnlockForm } from './UnlockForm'

export default async function UnlockPage({ params, searchParams }: { params: { id: string }; searchParams: { workerId?: string } }) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const workerId = searchParams.workerId
  if (!workerId) notFound()

  const [job, worker, existingUnlock] = await Promise.all([
    prisma.job.findUnique({ where: { id: params.id, customerId: session.id } }),
    prisma.user.findUnique({ where: { id: workerId, role: 'WORKER' }, include: { workerProfile: true } }),
    prisma.contactUnlock.findFirst({ where: { jobId: params.id, customerId: session.id, workerId } })
  ])
  if (!job || !worker) notFound()

  if (existingUnlock) {
    return (
      <div className="min-h-screen">
        <Navbar user={session} />
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="card text-center">
            <div className="text-4xl mb-3">📞</div>
            <h2 className="text-xl font-display text-earth-900 mb-2">Contact Unlocked</h2>
            <p className="text-earth-600 mb-4">You have already unlocked {worker.name}'s contact details.</p>
            <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-4">
              <p className="font-bold text-sage-900 text-lg">{worker.phoneNumber || 'No phone on file'}</p>
            </div>
            <Link href={`/dashboard/customer/jobs/${params.id}/applicants`} className="btn-outline btn-sm">← Back to Applicants</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-lg mx-auto px-4 py-8">
        <Link href={`/dashboard/customer/jobs/${params.id}/applicants`} className="text-earth-500 text-sm hover:text-earth-700">← Back to Applicants</Link>
        <h1 className="page-title mt-2 mb-6">Unlock Contact</h1>
        <UnlockForm jobId={params.id} workerId={workerId} workerName={worker.name} />
      </div>
    </div>
  )
}
