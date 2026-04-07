import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Edit, MapPin, Users, Wallet } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { JobStatusBadge } from '@/components/ui/Badge'
import { formatBWP, formatDate, formatRelativeTime } from '@/lib/utils'
import { CloseJobButton, CompleteJobButton } from './actions'
import { RaiseDisputeButton } from '@/components/disputes/RaiseDisputeButton'

export default async function CustomerJobDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      customer: { select: { id: true, name: true } },
      _count: { select: { applications: true } },
    },
  })

  if (!job) notFound()
  if (job.customer.id !== session.id) redirect('/dashboard/customer/jobs')

  const detailItems = [
    { label: 'Category', value: job.category.name },
    { label: 'Location', value: job.area, icon: MapPin },
    { label: 'Budget', value: formatBWP(job.budget), icon: Wallet },
    { label: 'Preferred date', value: formatDate(job.preferredDate) },
    { label: 'Urgency', value: job.urgency.replace(/_/g, ' ') },
    { label: 'Posted', value: formatRelativeTime(job.createdAt) },
  ]

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/dashboard/customer/jobs" className="subtle-link inline-flex items-center gap-2">
            Back to my jobs
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="page-title">{job.title}</h1>
            <JobStatusBadge status={job.status} />
          </div>
          <p className="mt-2 text-sm leading-6 text-earth-500">
            Review the listing details, edit the job, or continue to the applicant queue.
          </p>
        </div>
        <div className="rounded-2xl border border-earth-200 bg-white px-4 py-3 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-earth-500">Applicants</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-earth-950">{job._count.applications}</div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {detailItems.map(({ label, value, icon: Icon }) => (
          <div key={label} className="muted-panel p-4">
            <div className="kicker mb-2">{label}</div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-earth-900">
              {Icon ? <Icon size={15} /> : null}
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="kicker mb-2">Description</div>
        <p className="whitespace-pre-wrap text-sm leading-7 text-earth-700">{job.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
        <div className="card">
          <div className="kicker mb-2">Hiring queue</div>
          <h2 className="text-xl font-bold tracking-tight text-earth-950">Review applicants</h2>
          <p className="mt-2 text-sm leading-6 text-earth-500">
            Compare applicants, select a worker, and continue to the contact unlock step when you are ready.
          </p>
          <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-primary mt-5">
            <Users size={16} />
            View applicants
          </Link>
        </div>

        <div className="card">
          <div className="kicker mb-2">Actions</div>
          <h2 className="text-xl font-bold tracking-tight text-earth-950">Manage this listing</h2>
          <div className="mt-4 space-y-3">
            {job.status === 'OPEN' && (
              <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-secondary w-full">
                <Edit size={15} />
                Edit job
              </Link>
            )}
            {(job.status === 'OPEN' || job.status === 'IN_PROGRESS') && <CloseJobButton jobId={job.id} />}
            {job.status === 'IN_PROGRESS' && <CompleteJobButton jobId={job.id} />}
            {job.status === 'IN_PROGRESS' && <RaiseDisputeButton jobId={job.id} />}
          </div>
        </div>
      </div>
    </div>
  )
}
