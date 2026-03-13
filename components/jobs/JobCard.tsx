import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatBWP, timeAgo, urgencyLabel, urgencyColor, jobStatusLabel, statusColor } from '@/lib/utils'
import { BriefcaseBusiness, Clock3, MapPin, Users } from 'lucide-react'

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
    <Link href={`/jobs/${job.id}`} className="block">
      <div className="card h-full transition-all duration-150 hover:-translate-y-0.5 hover:border-earth-300 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-earth-500">
              <BriefcaseBusiness size={14} />
              {job.category.name}
            </div>
            <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-earth-950">{job.title}</h3>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={urgencyColor(job.urgency)}>{urgencyLabel(job.urgency)}</Badge>
            {showStatus && <Badge className={statusColor(job.status)}>{jobStatusLabel(job.status)}</Badge>}
          </div>
        </div>

        <p className="mb-5 line-clamp-3 text-sm leading-6 text-earth-600">{job.description}</p>

        <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl border border-earth-200 bg-earth-50 p-3 text-sm">
          <div>
            <div className="kicker mb-1">Budget</div>
            <div className="font-semibold text-earth-900">{formatBWP(job.budget)}</div>
          </div>
          <div>
            <div className="kicker mb-1">Posted</div>
            <div className="font-semibold text-earth-900">{timeAgo(job.createdAt)}</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-earth-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={15} />
            {job.area}
          </span>
          {job._count != null && (
            <span className="inline-flex items-center gap-1.5">
              <Users size={15} />
              {job._count.applications} applicant{job._count.applications === 1 ? '' : 's'}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={15} />
            {job.customer.name}
          </span>
        </div>
      </div>
    </Link>
  )
}
