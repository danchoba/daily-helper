import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { EmptyState } from '@/components/ui/EmptyState'
import { appStatusLabel, formatBWP, statusColor, timeAgo } from '@/lib/utils'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { WithdrawApplicationButton } from './WithdrawApplicationButton'
import { RaiseDisputeButton } from '@/components/disputes/RaiseDisputeButton'
import { MessageButton } from '@/components/messages/MessageButton'

export default async function WorkerApplicationsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')

  const applications = await prisma.jobApplication.findMany({
    where: { workerId: session.id },
    include: {
      job: {
        include: { category: true, customer: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard/worker' },
          { label: 'My Applications' },
        ]} />
        <div className="mb-6">
          <div className="kicker mb-2">Applications</div>
          <h1 className="page-title">My applications</h1>
        </div>

        {applications.length === 0 ? (
          <EmptyState
            title="No applications submitted yet"
            description="Browse the open jobs list and apply to opportunities that match your services and area."
            action={<Link href="/dashboard/worker/jobs" className="btn-primary">Browse jobs</Link>}
          />
        ) : (
          <div className="space-y-4">
            {applications.map(application => (
              <div key={application.id} className="card">
                <div className="flex flex-col gap-3 border-b border-earth-200 pb-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Link href={`/jobs/${application.jobId}`} className="text-lg font-bold tracking-tight text-earth-950 hover:text-earth-700">
                      {application.job.title}
                    </Link>
                    <p className="mt-1 text-sm text-earth-500">
                      {application.job.area} · {application.job.category.name} · {application.job.customer.name}
                    </p>
                  </div>
                  <span className={`badge ${statusColor(application.status)}`}>
                    {appStatusLabel(application.status)}
                  </span>
                </div>

                <div className="py-4">
                  <div className="kicker mb-2">Your message</div>
                  <p className="text-sm leading-6 text-earth-700">{application.message}</p>
                </div>

                <div className="flex flex-col gap-2 border-t border-earth-200 pt-4 text-sm text-earth-500 md:flex-row md:items-center md:justify-between">
                  <span>Budget: <span className="font-semibold text-earth-900">{formatBWP(application.job.budget)}</span></span>
                  <div className="flex items-center gap-3">
                    <span>Applied {timeAgo(application.createdAt)}</span>
                    {application.status === 'PENDING' && (
                      <WithdrawApplicationButton jobId={application.jobId} />
                    )}
                  </div>
                </div>

                {application.status === 'SELECTED' && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">
                      You have been selected for this job. The customer can now unlock your contact details to coordinate directly.
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <MessageButton
                        jobId={application.jobId}
                        workerId={application.workerId}
                        basePath="/dashboard/worker"
                      />
                      <RaiseDisputeButton jobId={application.jobId} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
