import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { SelectApplicantButton } from './SelectApplicantButton'
import { CompleteJobButton } from './CompleteJobButton'
import { formatBWP, timeAgo } from '@/lib/utils'

export default async function ApplicantsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const job = await prisma.job.findUnique({
    where: { id: params.id, customerId: session.id },
    include: {
      category: true,
      applications: {
        include: {
          worker: { include: { workerProfile: true } }
        },
        orderBy: { createdAt: 'asc' }
      },
      contactUnlocks: { where: { customerId: session.id } }
    }
  })
  if (!job) notFound()

  const selectedApp = job.applications.find(a => a.status === 'SELECTED')
  const unlockedWorkerIds = new Set(job.contactUnlocks.map(u => u.workerId))

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard/customer/jobs" className="text-earth-500 text-sm hover:text-earth-700">← My Jobs</Link>
        <h1 className="page-title mt-2 mb-1">{job.title}</h1>
        <p className="text-earth-500 mb-6 text-sm">{job.applications.length} applicant{job.applications.length !== 1 ? 's' : ''} · {job.status}</p>

        {job.status === 'IN_PROGRESS' && selectedApp && (
          <div className="card bg-brand-50 border-brand-200 mb-6">
            <h3 className="font-semibold text-brand-800 mb-2">Job in progress</h3>
            <p className="text-brand-700 text-sm mb-4">You have selected <strong>{selectedApp.worker.name}</strong>. Once the job is done, mark it as completed.</p>
            <CompleteJobButton jobId={job.id} workerId={selectedApp.workerId} />
          </div>
        )}

        {job.applications.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-4xl mb-3">⏳</div>
            <p className="font-semibold text-earth-700">No applications yet</p>
            <p className="text-earth-500 text-sm mt-1">Workers will apply soon. Share your job to get more visibility.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {job.applications.map(app => {
              const profile = app.worker.workerProfile
              const isSelected = app.status === 'SELECTED'
              const isUnlocked = unlockedWorkerIds.has(app.workerId)

              return (
                <div key={app.id} className={`card ${isSelected ? 'border-brand-300 bg-brand-50/30' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-lg font-bold text-brand-600 flex-shrink-0">
                      {app.worker.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link href={`/workers/${app.workerId}`} className="font-semibold text-earth-900 hover:text-brand-600">
                          {app.worker.name}
                        </Link>
                        {profile?.trustedBadge && <span className="trusted-badge">✓ Trusted</span>}
                        <span className={`badge text-xs ${
                          app.status === 'SELECTED' ? 'bg-brand-100 text-brand-800' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-earth-100 text-earth-600'
                        }`}>{app.status}</span>
                      </div>
                      {profile && (
                        <div className="flex items-center gap-3 text-xs text-earth-500 mb-2">
                          {profile.averageRating > 0 && <span>⭐ {profile.averageRating}</span>}
                          <span>{profile.jobsCompleted} jobs done</span>
                          {profile.area && <span>📍 {profile.area}</span>}
                        </div>
                      )}
                      <p className="text-earth-600 text-sm">{app.message}</p>
                      <p className="text-xs text-earth-400 mt-2">{timeAgo(app.createdAt)}</p>
                    </div>
                  </div>

                  {job.status === 'OPEN' && app.status === 'PENDING' && (
                    <div className="mt-4 pt-4 border-t border-earth-100">
                      <SelectApplicantButton jobId={job.id} applicationId={app.id} workerName={app.worker.name} />
                    </div>
                  )}

                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-earth-100">
                      {isUnlocked ? (
                        <div className="bg-sage-50 border border-sage-200 rounded-xl p-3">
                          <p className="text-sage-800 font-medium text-sm">📞 Contact unlocked</p>
                          <p className="text-sage-700 text-sm mt-1">{app.worker.phoneNumber || 'No phone number on file'}</p>
                        </div>
                      ) : (
                        <div className="bg-brand-50 border border-brand-200 rounded-xl p-3">
                          <p className="text-brand-800 font-medium text-sm mb-2">Unlock contact to connect</p>
                          <p className="text-brand-700 text-xs mb-3">Pay BWP 25 connection fee to reveal {app.worker.name}'s phone number</p>
                          <Link href={`/dashboard/customer/jobs/${job.id}/unlock?workerId=${app.workerId}`} className="btn-primary btn-sm">
                            Unlock Contact — BWP 25
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
    </div>
  )
}
