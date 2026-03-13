import Link from 'next/link'
import { formatBWP, timeAgo, urgencyLabel, urgencyColor, jobStatusLabel, statusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface JobCardProps {
  job: {
    id: string
    title: string
    description: string
    area: string
    budget?: number | null
    urgency: string
    status: string
    createdAt: Date | string
    category: { name: string; icon?: string | null }
    customer: { name: string }
    _count?: { applications: number }
  }
  showStatus?: boolean
}

export function JobCard({ job, showStatus }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="card hover:shadow-md hover:border-earth-200 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{job.category.icon || '🛠️'}</span>
            <span className="text-xs font-medium text-earth-500">{job.category.name}</span>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <span className={`badge ${urgencyColor(job.urgency)}`}>{urgencyLabel(job.urgency)}</span>
            {showStatus && (
              <span className={`badge ${statusColor(job.status)}`}>{jobStatusLabel(job.status)}</span>
            )}
          </div>
        </div>
        <h3 className="font-semibold text-earth-900 text-base mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">{job.title}</h3>
        <p className="text-earth-500 text-sm mb-4 line-clamp-2">{job.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-earth-500">
            <span className="flex items-center gap-1">📍 {job.area}</span>
            {job._count != null && (
              <span className="flex items-center gap-1">👤 {job._count.applications} applied</span>
            )}
          </div>
          <div className="text-right">
            <div className="font-bold text-earth-900">{formatBWP(job.budget)}</div>
            <div className="text-xs text-earth-400">{timeAgo(job.createdAt)}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
