import Link from 'next/link'
import { ArrowRight, BadgeCheck, BriefcaseBusiness, MapPin, Star } from 'lucide-react'

interface LandingWorkerCardProps {
  index: number
  worker: {
    id: string
    area?: string | null
    bio?: string | null
    servicesOffered: string[]
    trustedBadge: boolean
    averageRating: number
    jobsCompleted: number
    user: { name: string }
  }
}

const accents = [
  {
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F8FF_100%)]',
    border: 'border-[#D8E5F8]',
    glow: 'bg-[#DBEAFE]',
    avatar: 'bg-[linear-gradient(180deg,#1D4ED8_0%,#60A5FA_100%)]',
  },
  {
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F1FFFC_100%)]',
    border: 'border-[#CDEEE8]',
    glow: 'bg-[#CCFBF1]',
    avatar: 'bg-[linear-gradient(180deg,#0F766E_0%,#2DD4BF_100%)]',
  },
  {
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F5FF_100%)]',
    border: 'border-[#E5DBFF]',
    glow: 'bg-[#E9D5FF]',
    avatar: 'bg-[linear-gradient(180deg,#7C3AED_0%,#A78BFA_100%)]',
  },
] as const

export function LandingWorkerCard({ worker, index }: LandingWorkerCardProps) {
  const accent = accents[index % accents.length]

  return (
    <Link href={`/workers/${worker.id}`} className="group block h-full">
      <div
        className={`relative h-full overflow-hidden rounded-[30px] border ${accent.border} ${accent.surface} p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)] sm:p-6`}
      >
        <div className={`float-soft absolute -right-8 top-4 h-24 w-24 rounded-full ${accent.glow} blur-3xl`} />

        <div className="relative">
          <div className="flex items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent.avatar} text-lg font-bold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]`}>
              {worker.user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold tracking-[-0.03em] text-[#0F172A]">{worker.user.name}</h3>
                {worker.trustedBadge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#15803D]">
                    <BadgeCheck size={12} />
                    Trusted
                  </span>
                )}
              </div>
              {worker.area && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[#64748B]">
                  <MapPin size={14} />
                  {worker.area}
                </p>
              )}
            </div>
          </div>

          <p className="mt-5 line-clamp-3 text-sm leading-7 text-[#475569] sm:text-base">
            {worker.bio || 'Reliable local support for everyday jobs, with a profile customers can review before hiring.'}
          </p>

          {worker.servicesOffered.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {worker.servicesOffered.slice(0, 3).map(service => (
                <span
                  key={service}
                  className="rounded-full border border-[#DCE6F3] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#334155]"
                >
                  {service}
                </span>
              ))}
              {worker.servicesOffered.length > 3 && (
                <span className="rounded-full border border-[#DCE6F3] bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#64748B]">
                  +{worker.servicesOffered.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="mt-6 grid gap-3 rounded-[24px] border border-[#E2E8F0] bg-white/80 p-4 sm:grid-cols-2">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
              <Star size={15} className="text-[#F59E0B]" />
              {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'New profile'}
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
              <BriefcaseBusiness size={15} className="text-[#1D4ED8]" />
              {worker.jobsCompleted} completed jobs
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            View profile
            <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
