import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { JobStatusBadge, Badge } from '@/components/ui/Badge'
import { formatBWP, formatDate, formatRelativeTime } from '@/lib/utils'
import { MapPin, Calendar, DollarSign, Users, Edit, X, CheckCircle } from 'lucide-react'
import { CloseJobButton, CompleteJobButton } from './actions'

export default async function CustomerJobDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session?.user) redirect('/login')

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      customer: { include: { user: true } },
      _count: { select: { applications: true } },
    },
  })

  if (!job) notFound()
  if (job.customer.userId !== session.user.id) redirect('/dashboard/customer/jobs')

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start gap-3">
        <div>
          <Link href="/dashboard/customer/jobs" className="text-sm text-earth-500 hover:text-brand-600 mb-2 block">← My Jobs</Link>
          <h1 className="font-display text-xl font-bold text-earth-900">{job.title}</h1>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      <div className="card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-earth-400 text-xs">Category</span><p className="font-semibold text-earth-800 mt-0.5">{job.category.name}</p></div>
          <div><span className="text-earth-400 text-xs">Location</span><p className="font-semibold text-earth-800 mt-0.5">{job.area}</p></div>
          {job.budget && <div><span className="text-earth-400 text-xs">Budget</span><p className="font-semibold text-forest-600 mt-0.5">{formatBWP(job.budget)}</p></div>}
          {job.preferredDate && <div><span className="text-earth-400 text-xs">Date</span><p className="font-semibold text-earth-800 mt-0.5">{formatDate(job.preferredDate)}</p></div>}
          <div><span className="text-earth-400 text-xs">Urgency</span><p className="font-semibold text-earth-800 mt-0.5 capitalize">{job.urgency}</p></div>
          <div><span className="text-earth-400 text-xs">Posted</span><p className="font-semibold text-earth-800 mt-0.5">{formatRelativeTime(job.createdAt)}</p></div>
        </div>

        <div>
          <span className="text-earth-400 text-xs">Description</span>
          <p className="text-earth-600 text-sm mt-1 whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="card p-4">
        <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-primary flex items-center justify-center gap-2 w-full mb-3">
          <Users size={16} />View Applicants ({job._count.applications})
        </Link>
        <div className="flex gap-3">
          {job.status === 'open' && (
            <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-secondary flex items-center gap-2 flex-1 justify-center text-sm">
              <Edit size={14} />Edit
            </Link>
          )}
          {(job.status === 'open' || job.status === 'in_progress') && (
            <CloseJobButton jobId={job.id} />
          )}
          {job.status === 'in_progress' && (
            <CompleteJobButton jobId={job.id} />
          )}
        </div>
      </div>
    </div>
  )
}
