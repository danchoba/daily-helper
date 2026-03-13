import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, DollarSign, Clock, ArrowLeft, Share2, Users } from 'lucide-react'
import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import { JobStatusBadge, Badge } from '@/components/ui/Badge'
import { formatBWP, formatDate, formatRelativeTime } from '@/lib/utils'
import { ApplyButton } from './ApplyButton'

async function getJob(id: string) {
  return prisma.job.findUnique({
    where: { id },
    include: {
      category: true,
      customer: { include: { user: { select: { id: true, name: true } } } },
      _count: { select: { applications: true } },
    },
  })
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const [job, session] = await Promise.all([getJob(params.id), getSession()])

  if (!job) notFound()

  const isCustomer = session?.user.id === job.customer.user.id
  const isWorker = session?.user.role === 'worker'
  const canApply = isWorker && job.status === 'open'

  const whatsappText = encodeURIComponent(`Check out this job on Daily Helper: ${job.title} in ${job.area}`)
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/jobs" className="flex items-center gap-1.5 text-earth-500 hover:text-brand-600 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />Back to Jobs
      </Link>

      <div className="card p-6 mb-4">
        <div className="flex justify-between items-start gap-3 mb-4">
          <h1 className="font-display text-xl font-bold text-earth-900 leading-snug">{job.title}</h1>
          <JobStatusBadge status={job.status} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="default">{job.category.name}</Badge>
          <Badge variant={job.urgency === 'urgent' ? 'danger' : job.urgency === 'high' ? 'warning' : 'neutral'}>
            {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} urgency
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-earth-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-earth-500 text-xs mb-1"><MapPin size={12} />Location</div>
            <p className="font-semibold text-earth-800 text-sm">{job.area}</p>
          </div>
          {job.budget && (
            <div className="bg-earth-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-earth-500 text-xs mb-1"><DollarSign size={12} />Budget</div>
              <p className="font-semibold text-forest-600 text-sm">{formatBWP(job.budget)}</p>
            </div>
          )}
          {job.preferredDate && (
            <div className="bg-earth-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-earth-500 text-xs mb-1"><Calendar size={12} />Date</div>
              <p className="font-semibold text-earth-800 text-sm">{formatDate(job.preferredDate)}</p>
            </div>
          )}
          <div className="bg-earth-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-earth-500 text-xs mb-1"><Users size={12} />Applicants</div>
            <p className="font-semibold text-earth-800 text-sm">{job._count.applications} applied</p>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="font-semibold text-earth-800 mb-2">Description</h2>
          <p className="text-earth-600 text-sm whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-earth-400 pt-4 border-t border-earth-100">
          <span>Posted by {job.customer.user.name} · {formatRelativeTime(job.createdAt)}</span>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:text-green-700">
            <Share2 size={13} />Share
          </a>
        </div>
      </div>

      {/* Action area */}
      {isCustomer && (
        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-primary flex-1 text-center">
            View Applicants ({job._count.applications})
          </Link>
          <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-secondary flex-1 text-center">
            Edit Job
          </Link>
        </div>
      )}

      {canApply && <ApplyButton jobId={job.id} />}

      {!session && (
        <div className="card p-5 text-center">
          <p className="text-earth-600 mb-3 text-sm">Sign in to apply for this job</p>
          <Link href="/login" className="btn-primary">Login to Apply</Link>
        </div>
      )}
    </div>
  )
}
