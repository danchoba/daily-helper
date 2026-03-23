'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { formatBWP, timeAgo, urgencyLabel, urgencyColor, jobStatusLabel, statusColor } from '@/lib/utils'
import { BriefcaseBusiness, Clock3, MapPin, Users, ArrowUpRight } from 'lucide-react'

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
    <Link href={`/jobs/${job.id}`} className="block h-full" aria-label={`View job: ${job.title} in ${job.area}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.005 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="group relative h-full overflow-hidden rounded-3xl border border-earth-200/80 bg-white shadow-card transition-shadow duration-300 hover:border-brand-200 hover:shadow-card-hover"
      >
        {/* Top accent stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-brand-500 via-accent-400 to-sage-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-earth-400">
                <BriefcaseBusiness size={13} aria-hidden="true" />
                {job.category.name}
              </div>
              <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-earth-950">
                {job.title}
              </h3>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <Badge className={urgencyColor(job.urgency)}>{urgencyLabel(job.urgency)}</Badge>
              {showStatus && <Badge className={statusColor(job.status)}>{jobStatusLabel(job.status)}</Badge>}
            </div>
          </div>

          {/* Description */}
          <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-earth-500">
            {job.description}
          </p>

          {/* Budget / Posted row */}
          <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl border border-earth-100 bg-earth-50/60 p-3">
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-earth-400">Budget</div>
              <div className="text-sm font-bold text-earth-900">{formatBWP(job.budget)}</div>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-earth-400">Posted</div>
              <div className="text-sm font-bold text-earth-900">{timeAgo(job.createdAt)}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 text-xs text-earth-400">
              <span className="flex items-center gap-1">
                <MapPin size={12} aria-hidden="true" />{job.area}
              </span>
              {job._count != null && (
                <span className="flex items-center gap-1">
                  <Users size={12} aria-hidden="true" />{job._count.applications} applicant{job._count.applications === 1 ? '' : 's'}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock3 size={12} aria-hidden="true" />{job.customer.name}
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <ArrowUpRight size={14} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
