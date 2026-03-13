import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { formatCurrency, formatDate, truncate } from '@/lib/utils'
import type { Job, Category, CustomerProfile, User } from '@prisma/client'

type JobCardJob = Job & {
  category: Category
  customer?: CustomerProfile & { user: User }
  _count?: { applications: number }
}

interface JobCardProps {
  job: JobCardJob
  href?: string
}

const urgencyColors: Record<string, 'warning' | 'danger' | 'default'> = {
  urgent: 'danger',
  normal: 'default',
  low: 'default',
}

const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'default' | 'info'> = {
  open: 'success',
  in_progress: 'info',
  completed: 'default',
  cancelled: 'danger',
  closed: 'warning',
}

export default function JobCard({ job, href }: JobCardProps) {
  const link = href || `/jobs/${job.id}`

  return (
    <Link href={link} className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{job.title}</h3>
        {job.urgency === 'urgent' && (
          <Badge variant="danger" className="shrink-0">Urgent</Badge>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{truncate(job.description, 120)}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <Badge variant="info">{job.category.name}</Badge>
        <Badge variant={statusColors[job.status]}>{job.status.replace('_', ' ')}</Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span>📍 {job.area}</span>
          {job._count && <span>👥 {job._count.applications} applicant{job._count.applications !== 1 ? 's' : ''}</span>}
        </div>
        {job.budget && (
          <span className="font-semibold text-gray-900">{formatCurrency(job.budget)}</span>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-2">{formatDate(job.createdAt)}</p>
    </Link>
  )
}
