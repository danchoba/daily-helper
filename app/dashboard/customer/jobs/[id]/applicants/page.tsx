import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { SelectApplicantButton } from './SelectApplicantButton'
import { CompleteJobButton } from './CompleteJobButton'
import { timeAgo } from '@/lib/utils'

export default async function ApplicantsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const job = await prisma.job.findUnique({
    where: { id: params.id, customerId: session.id },
    include: {
      category: true,
      applications: {
        include: {
          worker: { include: { workerProfile: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
      contactUnlocks: { where: { customerId: session.id } },
    },
  })

  if (!job) notFound()

  const selectedApp = job.applications.find(application => application.status === 'SELECTED')
  const unlockedWorkerIds = new Set(job.contactUnlocks.map(unlock => unlock.workerId))

  return (
    <div className="max-w-4xl">
        <Link href="/dashboard/customer/jobs" className="subtle-link inline-flex items-center gap-2">
          Back to my jobs
        </Link>

        <div className="mb-6 mt-3">
          <div className="kicker mb-2">Applicant review</div>
          <h1 className="page-title">{job.title}</h1>
          <p className="mt-2 text-sm leading-6 text-earth-500">
            {job.applications.length} applicant{job.applications.length === 1 ? '' : 's'} · Current status: {job.status.replace(/_/g, ' ')}
          </p>
        </div>

        {job.status === 'IN_PROGRESS' && selectedApp && (
          <div className="mb-6 rounded-2xl border border-earth-200 bg-earth-50 p-5">
            <h2 className="text-lg font-bold tracking-tight text-earth-900">Job in progress</h2>
            <p className="mt-1 text-sm leading-6 text-earth-600">
              You selected <strong>{selectedApp.worker.name}</strong>. When the job is finished, complete it here and leave a review.
            </p>
            <div className="mt-4">
              <CompleteJobButton jobId={job.id} workerId={selectedApp.workerId} />
            </div>
          </div>
        )}

        {job.applications.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <h2 className="text-lg font-bold tracking-tight text-earth-900">No applications yet</h2>
            <p className="mt-2 text-sm text-earth-500">Workers will appear here as they apply for the job.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {job.applications.map(application => {
              const profile = application.worker.workerProfile
              const isSelected = application.status === 'SELECTED'
              const isUnlocked = unlockedWorkerIds.has(application.workerId)

              return (
                <div key={application.id} className={`card ${isSelected ? 'border-earth-400' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth-900 text-base font-bold text-white">
                      {application.worker.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Link href={`/workers/${application.workerId}`} className="text-base font-bold tracking-tight text-earth-950 hover:text-earth-700">
                          {application.worker.name}
                        </Link>
                        {profile?.trustedBadge && (
                          <span className="rounded-full border border-sage-200 bg-sage-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage-800">
                            Trusted
                          </span>
                        )}
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                            application.status === 'SELECTED'
                              ? 'border border-earth-900 bg-earth-900 text-white'
                              : application.status === 'REJECTED'
                                ? 'border border-red-200 bg-red-50 text-red-700'
                                : 'border border-earth-200 bg-earth-50 text-earth-600'
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>

                      {profile && (
                        <div className="mb-3 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.08em] text-earth-500">
                          {profile.averageRating > 0 && <span>{profile.averageRating.toFixed(1)} rating</span>}
                          <span>{profile.jobsCompleted} completed jobs</span>
                          {profile.area && <span>{profile.area}</span>}
                        </div>
                      )}

                      <p className="text-sm leading-6 text-earth-700">{application.message}</p>
                      <p className="mt-3 text-xs text-earth-400">{timeAgo(application.createdAt)}</p>
                    </div>
                  </div>

                  {job.status === 'OPEN' && application.status === 'PENDING' && (
                    <div className="mt-4 border-t border-earth-200 pt-4">
                      <SelectApplicantButton jobId={job.id} applicationId={application.id} workerName={application.worker.name} />
                    </div>
                  )}

                  {isSelected && (
                    <div className="mt-4 border-t border-earth-200 pt-4">
                      {isUnlocked ? (
                        <div className="rounded-xl border border-sage-200 bg-sage-50 p-4">
                          <p className="text-sm font-semibold text-sage-800">Contact unlocked</p>
                          <p className="mt-1 text-sm text-sage-700">{application.worker.phoneNumber || 'No phone number on file'}</p>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-earth-200 bg-earth-50 p-4">
                          <p className="text-sm font-semibold text-earth-900">Unlock contact details</p>
                          <p className="mt-1 text-sm leading-6 text-earth-600">
                            Pay the BWP 25 connection fee to reveal {application.worker.name}&rsquo;s phone number and coordinate directly.
                          </p>
                          <Link href={`/dashboard/customer/jobs/${job.id}/unlock?workerId=${application.workerId}`} className="btn-primary mt-3">
                            Unlock contact
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}
