import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, Clock3, MapPin, Users } from 'lucide-react'
import { formatBWP, timeAgo, urgencyLabel } from '@/lib/utils'

interface LandingJobCardProps {
  index: number
  job: {
    id: string
    title: string
    description: string
    area: string
    budget?: number | null
    urgency: string
    createdAt: Date | string
    category: { name: string }
    customer: { name: string }
    _count?: { applications: number }
  }
}

const surfaces = [
  {
    border: 'border-[#BFD5FF]',
    background: 'bg-[linear-gradient(145deg,#102452_0%,#1F4ED8_52%,#2D74F2_100%)]',
    glow: 'bg-[#60A5FA]/35',
    pill: 'bg-white/14 text-white',
  },
  {
    border: 'border-[#9BD7D3]',
    background: 'bg-[linear-gradient(145deg,#0F2748_0%,#155E75_48%,#14B8A6_100%)]',
    glow: 'bg-[#5EEAD4]/30',
    pill: 'bg-white/14 text-white',
  },
] as const

export function LandingJobCard({ job, index }: LandingJobCardProps) {
  const surface = surfaces[index % surfaces.length]

  return (
    <Link href={`/jobs/${job.id}`} className="group block h-full">
      <div
        className={`relative h-full overflow-hidden rounded-[30px] border ${surface.border} ${surface.background} p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_72px_rgba(15,23,42,0.2)] sm:p-6`}
      >
        <div className={`hero-glow absolute -right-8 top-4 h-28 w-28 rounded-full ${surface.glow} blur-3xl`} />
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-50">
                <BriefcaseBusiness size={12} />
                {job.category.name}
              </div>
              <h3 className="mt-4 line-clamp-2 text-[1.35rem] font-bold leading-tight tracking-[-0.04em] text-white sm:text-[1.6rem]">
                {job.title}
              </h3>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${surface.pill}`}>
              {urgencyLabel(job.urgency)}
            </span>
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-100/92 sm:text-base">
            {job.description}
          </p>

          <div className="mt-5 grid gap-3 rounded-[24px] border border-white/12 bg-white/8 p-4 sm:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">Budget</div>
              <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{formatBWP(job.budget)}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">Posted</div>
              <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{timeAgo(job.createdAt)}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-100/92">
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

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
            View job
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
