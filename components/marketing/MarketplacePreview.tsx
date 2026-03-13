import { BadgeCheck, BriefcaseBusiness, Clock3, MapPin, Users } from 'lucide-react'

const previewJobs = [
  {
    title: 'House cleaning for a two-bedroom apartment',
    budget: 'BWP 350',
    area: 'Gaborone West',
    applicants: '7 applicants',
    posted: 'Posted 18 min ago',
    accent: 'bg-[#DBEAFE] text-[#1F4ED8]',
    offset: 'translate-x-2 translate-y-6 rotate-[3deg]',
  },
  {
    title: 'Garden cleanup and trimming before the weekend',
    budget: 'BWP 420',
    area: 'Broadhurst',
    applicants: '4 applicants',
    posted: 'Posted 42 min ago',
    accent: 'bg-[#CCFBF1] text-[#0F766E]',
    offset: '-translate-x-3 rotate-[-3deg]',
  },
  {
    title: 'Queue assistance for a government office visit',
    budget: 'BWP 180',
    area: 'CBD',
    applicants: '10 applicants',
    posted: 'Posted 8 min ago',
    accent: 'bg-[#FFEDD5] text-[#F97316]',
    offset: 'translate-x-6 -translate-y-4 rotate-[4deg]',
  },
]

export function MarketplacePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="hero-grid absolute inset-8 rounded-[32px] border border-white/10 opacity-60" />
      <div className="hero-glow absolute left-10 top-8 h-40 w-40 rounded-full bg-[#14B8A6]/25 blur-3xl" />
      <div className="hero-glow absolute bottom-8 right-4 h-48 w-48 rounded-full bg-[#60A5FA]/30 blur-3xl" />

      <div className="absolute left-8 top-14 drift-particle h-3 w-3 rounded-full bg-white/50" />
      <div className="absolute right-10 top-24 drift-particle h-2 w-2 rounded-full bg-[#67E8F9]/60 [animation-delay:1s]" />
      <div className="absolute bottom-20 left-12 drift-particle h-2.5 w-2.5 rounded-full bg-[#A5F3FC]/60 [animation-delay:1.8s]" />

      <div className="relative px-3 py-8 sm:px-6">
        <div className="float-soft-delay absolute right-0 top-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
            <BadgeCheck size={14} />
            Trusted workers available
          </div>
        </div>

        <div className="float-soft rounded-[30px] border border-white/15 bg-white/10 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">Marketplace live preview</p>
              <h3 className="mt-2 text-xl font-bold text-white">Open opportunities nearby</h3>
            </div>
            <div className="rounded-xl bg-white/10 p-3 text-white">
              <BriefcaseBusiness size={18} />
            </div>
          </div>

          <div className="space-y-4">
            {previewJobs.map(job => (
              <div
                key={job.title}
                className={`rounded-3xl border border-white/15 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition-transform duration-500 ${job.offset}`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${job.accent}`}>
                    Open job
                  </div>
                  <span className="text-sm font-bold text-[#0F172A]">{job.budget}</span>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
