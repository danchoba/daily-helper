import {
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react'

export function MarketplacePreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[640px]">
      <div className="hero-glow absolute left-[14%] top-6 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="hero-glow absolute bottom-14 right-[6%] h-48 w-48 rounded-full bg-[#A5D8FF]/35 blur-3xl" />
      <div className="hero-glow absolute left-[4%] top-[42%] h-28 w-28 rounded-full bg-[#8B5CF6]/10 blur-3xl" />

      <div className="relative min-h-[540px] px-2 pb-10 pt-6 sm:min-h-[660px] sm:px-0 sm:pb-0 sm:pt-10">
        <div className="drift-particle absolute left-[18%] top-[10%] h-2.5 w-2.5 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.85)]" />
        <div className="drift-particle absolute left-[8%] top-[46%] h-2 w-2 rounded-full bg-[#C4E6FF]/80 [animation-delay:1.4s]" />
        <div className="drift-particle absolute right-[8%] top-[22%] h-3 w-3 rounded-full bg-white/75 shadow-[0_0_20px_rgba(255,255,255,0.8)] [animation-delay:2.2s]" />

        <div className="float-soft-delay absolute right-[2%] top-4 w-[78%] rounded-[30px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(236,246,255,0.86))] px-5 py-6 text-[#5B6E95] shadow-[0_30px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:w-[82%] sm:px-6">
          <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs">
            <span>Live marketplace opportunities</span>
            <span className="text-sm font-semibold normal-case tracking-normal text-[#2C66DE]">Browse more</span>
          </div>
        </div>

        <div className="absolute right-[3%] top-[9.75rem] h-[24rem] w-[16%] rounded-[30px] border border-white/25 bg-white/12 shadow-[0_25px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:right-[1%] sm:top-[10.75rem] sm:h-[26rem]" />

        <div className="float-soft absolute left-0 top-[4.75rem] z-20 w-[84%] rounded-[30px] border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,248,255,0.93))] p-5 text-[#1D315C] shadow-[0_36px_100px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:left-[2%] sm:top-[5.5rem] sm:w-[80%] sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] sm:text-xs">
              <BriefcaseBusiness size={14} className="text-[#9A6B2C]" />
              Errands &amp; queue
            </div>
            <span className="rounded-full bg-[#FEE2E2] px-3 py-1 text-xs font-semibold text-[#C2410C]">Urgent</span>
          </div>

          <h3 className="mt-5 text-[1.7rem] font-bold leading-tight tracking-[-0.05em] text-[#213865] sm:text-[2.2rem]">
            Stand in queue at BPC offices
          </h3>
          <p className="mt-4 max-w-[32rem] text-sm leading-7 text-[#5A6784] sm:text-base">
            Need someone to stand in my place at BPC queue in the morning. Should be there by 7am and hold a spot until around 10am.
          </p>

          <div className="mt-6 grid gap-3 rounded-[24px] border border-[#E4EBF6] bg-white/85 p-4 sm:grid-cols-2 sm:p-5">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] sm:text-xs">Budget</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#213865]">BWP 80</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] sm:text-xs">Posted</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#213865]">40 mins ago</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5A6784] sm:text-base">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} className="text-[#9A6B2C]" />
              Gaborone
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={15} />
              2 km away
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#2396A1]">
              <BadgeCheck size={15} />
              Thabo Molefe
            </span>
          </div>
        </div>

        <div className="hidden float-soft-delay absolute right-0 top-[12rem] z-30 h-16 w-16 items-center justify-center rounded-[22px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(233,244,255,0.88))] text-[#7CAAF8] shadow-[0_24px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:flex">
          <Search size={24} />
        </div>
        <div className="hidden float-soft absolute right-[1.25rem] top-[17.25rem] z-30 h-16 w-16 items-center justify-center rounded-[22px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(233,244,255,0.88))] text-[#6B8EE8] shadow-[0_24px_50px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:flex">
          <ShieldCheck size={24} />
        </div>

        <div className="float-soft-delay absolute bottom-0 right-[6%] z-10 w-[78%] rounded-[30px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(222,237,255,0.8))] p-5 text-[#213865] shadow-[0_32px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:right-[10%] sm:w-[74%] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280] sm:text-xs">
              <BriefcaseBusiness size={14} className="text-[#6B7280]" />
              Moving &amp; lifting
            </div>
            <span className="rounded-full bg-[#F7EAD8] px-3 py-1 text-xs font-semibold text-[#9A6B2C]">High</span>
          </div>

          <h4 className="mt-4 text-xl font-bold leading-tight tracking-[-0.04em] text-[#213865] sm:text-[1.8rem]">
            Help moving furniture to new flat
          </h4>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5A6784] sm:text-base">
            <span>BWP 400</span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={15} />
              2 km away
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#2396A1]">
              <BadgeCheck size={15} />
              Thabo Molefe
            </span>
          </div>
        </div>

        <div className="absolute bottom-[1.75rem] left-[10%] z-0 flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-xl sm:bottom-[3.75rem]">
          <Clock3 size={14} />
          New jobs added live
        </div>
      </div>
    </div>
  )
}
