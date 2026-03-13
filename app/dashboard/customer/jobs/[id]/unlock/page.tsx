import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { UnlockForm } from './UnlockForm'

export default async function UnlockPage({ params, searchParams }: { params: { id: string }; searchParams: { workerId?: string } }) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const workerId = searchParams.workerId
  if (!workerId) notFound()

  const [job, worker, existingUnlock] = await Promise.all([
    prisma.job.findUnique({ where: { id: params.id, customerId: session.id } }),
    prisma.user.findUnique({ where: { id: workerId, role: 'WORKER' }, include: { workerProfile: true } }),
    prisma.contactUnlock.findFirst({ where: { jobId: params.id, customerId: session.id, workerId } }),
  ])

  if (!job || !worker) notFound()

  if (existingUnlock) {
    return (
      <div className="max-w-xl">
        <div className="card text-center">
          <h2 className="text-2xl font-bold tracking-tight text-earth-950">Contact already unlocked</h2>
          <p className="mt-2 text-sm leading-6 text-earth-600">
            You have already unlocked {worker.name}&rsquo;s contact details for this job.
          </p>
          <div className="mt-5 rounded-2xl border border-success-200 bg-success-50 p-4">
            <p className="text-sm font-medium text-success-700">Phone number</p>
            <p className="mt-1 text-lg font-bold text-success-900">{worker.phoneNumber || 'No phone on file'}</p>
          </div>
          <Link href={`/dashboard/customer/jobs/${params.id}/applicants`} className="btn-outline mt-5">
            Back to applicants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <Link href={`/dashboard/customer/jobs/${params.id}/applicants`} className="subtle-link inline-flex items-center gap-2">
        Back to applicants
      </Link>
      <h1 className="page-title mt-3 mb-6">Unlock contact</h1>
      <UnlockForm jobId={params.id} workerId={workerId} workerName={worker.name} />
    </div>
  )
}
