import {
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'

const previewJobs = [
  {
    title: 'Deep clean for a two-bedroom apartment',
    area: 'Gaborone West',
    budget: 'BWP 350',
    applicants: '7 applicants',
    posted: '18 min ago',
    tone: 'bg-[#DBEAFE] text-[#1F4ED8]',
    className: 'translate-x-1 translate-y-4 rotate-[3deg]',
  },
  {
    title: 'Weekend garden trimming and waste removal',
    area: 'Broadhurst',
    budget: 'BWP 420',
    applicants: '4 applicants',
    posted: '42 min ago',
    tone: 'bg-[#CCFBF1] text-[#0F766E]',
    className: '-translate-x-4 rotate-[-3deg]',
  },
  {
    title: 'Queue assistance for document collection',
    area: 'CBD',
    budget: 'BWP 180',
    applicants: '10 applicants',
    posted: '8 min ago',
    tone: 'bg-[#FFEDD5] text-[#F97316]',
    className: 'translate-x-5 -translate-y-3 rotate-[4deg]',
  },
]

const previewSignals = [
  { label: 'Job flow', value: 'Open listings' },
  { label: 'Trust', value: 'Verified profiles' },
  { label: 'Response', value: 'Fast local replies' },
]

export function MarketplacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div aria-hidden="true" className="hero-grid absolute inset-6 rounded-[36px] border border-white/10 opacity-50" />
      <div aria-hidden="true" className="hero-glow absolute left-6 top-10 h-40 w-40 rounded-full bg-[#14B8A6]/30 blur-3xl" />
      <div aria-hidden="true" className="hero-glow absolute bottom-6 right-4 h-48 w-48 rounded-full bg-[#60A5FA]/30 blur-3xl" />

      <div aria-hidden="true" className="absolute left-8 top-20 drift-particle h-3 w-3 rounded-full bg-white/60" />
      <div aria-hidden="true" className="absolute right-12 top-28 drift-particle h-2 w-2 rounded-full bg-[#A5F3FC]/70 [animation-delay:1.2s]" />
      <div aria-hidden="true" className="absolute bottom-24 left-12 drift-particle h-2.5 w-2.5 rounded-full bg-[#BFDBFE]/80 [animation-delay:2s]" />

      <div className="relative px-3 py-8 sm:px-6">
        <div className="float-soft-delay absolute right-2 top-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/90">
            <ShieldCheck size={14} />
            Contact stays protected
          </div>
        </div>

        <div className="float-soft rounded-[34px] border border-white/15 bg-white/10 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">Marketplace snapshot</p>
              <h3 className="mt-2 text-xl font-bold text-white">Live local opportunities</h3>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-white">
              <BriefcaseBusiness size={18} />
            </div>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-100">{previewSignals[0].label}</div>
              <div className="mt-2 text-xl font-bold text-white">{previewSignals[0].value}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-100">{previewSignals[1].label}</div>
              <div className="mt-2 text-xl font-bold text-white">{previewSignals[1].value}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-100">{previewSignals[2].label}</div>
              <div className="mt-2 text-xl font-bold text-white">{previewSignals[2].value}</div>
            </div>
          </div>

          <div className="space-y-4">
            {previewJobs.map(job => (
              <div
                key={job.title}
                className={`rounded-3xl border border-white/15 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-transform duration-500 ${job.className}`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${job.tone}`}>
                    Open now
                  </div>
                  <span aria-hidden="true" className="rounded-full bg-[#F8FAFC] p-2 text-[#0F172A]">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
                <h4 className="text-base font-bold leading-6 text-[#0F172A]">{job.title}</h4>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#64748B]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {job.area}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} />
                    {job.applicants}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {job.posted}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-4">
                  <span className="text-sm font-semibold text-[#0F172A]">{job.budget}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#14B8A6]">
                    <BadgeCheck size={12} />
                    Reviewed applicants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
