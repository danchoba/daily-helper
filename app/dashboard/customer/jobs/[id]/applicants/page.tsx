import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { SelectApplicantButton } from './SelectApplicantButton'
import { CompleteJobButton } from './CompleteJobButton'
import { MessageButton } from '@/components/messages/MessageButton'
import { timeAgo } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

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
    },
  })

  if (!job) notFound()

  const selectedApp = job.applications.find(application => application.status === 'SELECTED')

  return (
    <div className="max-w-4xl">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard/customer' },
          { label: 'My Jobs', href: '/dashboard/customer/jobs' },
          { label: job.title },
        ]} />

        <div className="mb-6">
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

        {job.status === 'COMPLETED' && selectedApp && (
          <div className="mb-6 rounded-2xl border border-sage-200 bg-sage-50 p-5">
            <h2 className="text-lg font-bold tracking-tight text-sage-900">Job completed</h2>
            <p className="mt-1 text-sm leading-6 text-sage-700">
              This job was completed by <strong>{selectedApp.worker.name}</strong>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/dashboard/customer/jobs/new?from=${job.id}`}
                className="btn-primary"
              >
                Post a similar job
              </Link>
              <Link
                href={`/workers/${selectedApp.workerId}`}
                className="btn-outline"
              >
                View {selectedApp.worker.name.split(' ')[0]}'s profile
              </Link>
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
                    <div className="mt-4 border-t border-earth-200 pt-4 space-y-3">
                      <div className="rounded-xl border border-sage-200 bg-sage-50 p-4">
                        <p className="text-sm font-semibold text-sage-800">Contact details</p>
                        <p className="mt-1 text-base font-bold text-sage-900">
                          {application.worker.phoneNumber || 'No phone number on file'}
                        </p>
                        <p className="mt-1 text-xs text-sage-600">
                          Reach out directly to coordinate the job.
                        </p>
                      </div>
                      <MessageButton
                        jobId={job.id}
                        workerId={application.workerId}
                        basePath="/dashboard/customer"
                      />
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
