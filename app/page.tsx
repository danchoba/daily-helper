import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
  Drill,
  Flower2,
  Hammer,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Reveal } from '@/components/marketing/Reveal'
import { MarketplacePreview } from '@/components/marketing/MarketplacePreview'
import { LandingJobCard } from '@/components/marketing/LandingJobCard'
import { LandingWorkerCard } from '@/components/marketing/LandingWorkerCard'

const categoryIcons: Record<string, LucideIcon> = {
  cleaning: Sparkles,
  gardening: Flower2,
  moving: BriefcaseBusiness,
  plumbing: Wrench,
  handyman: Hammer,
  repairs: Drill,
}

const platformSignals = [
  {
    icon: BriefcaseBusiness,
    label: 'Structured posting',
    value: 'Clear briefs, budgets, and timing from the first step.',
  },
  {
    icon: MapPin,
    label: 'Local relevance',
    value: 'Nearby work discovery without pretending the data is more precise than it is.',
  },
  {
    icon: ShieldCheck,
    label: 'Trust signals',
    value: 'Verification, reviews, and visible profile quality before hiring decisions.',
  },
  {
    icon: CreditCard,
    label: 'Protected contact',
    value: 'Contact unlock stays controlled until there is real hiring intent.',
  },
] as const

const workflowSteps = [
  {
    icon: BriefcaseBusiness,
    step: '01',
    title: 'Post the work',
    desc: 'Customers create a clean brief with area, timing, urgency, and budget guidance.',
  },
  {
    icon: Users,
    step: '02',
    title: 'Review applicants',
    desc: 'Workers apply nearby and customers compare profiles, trust signals, and fit.',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Unlock and coordinate',
    desc: 'Once ready to hire, the connection flow unlocks contact details for direct coordination.',
  },
] as const

const categorySurfaces = [
  {
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#EFF6FF_100%)]',
    border: 'border-[#DCE6F3]',
    icon: 'bg-[#DBEAFE] text-[#1D4ED8]',
    glow: 'bg-[#BFDBFE]',
  },
  {
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F1FFFC_100%)]',
    border: 'border-[#CDEEE8]',
    icon: 'bg-[#CCFBF1] text-[#0F766E]',
    glow: 'bg-[#99F6E4]',
  },
  {
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF7ED_100%)]',
    border: 'border-[#F5DEC3]',
    icon: 'bg-[#FFEDD5] text-[#C2410C]',
    glow: 'bg-[#FED7AA]',
  },
  {
    surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F8F5FF_100%)]',
    border: 'border-[#E4D8FF]',
    icon: 'bg-[#E9D5FF] text-[#7C3AED]',
    glow: 'bg-[#DDD6FE]',
  },
] as const

export default async function HomePage() {
  const session = await getServerSession()

  const [recentJobs, trustedWorkers, categories] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'OPEN' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        customer: { select: { name: true } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.workerProfile.findMany({
      where: { trustedBadge: true },
      take: 3,
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.category.findMany({ take: 8 }),
  ])

  const customerCta = session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'
  const workerCta = session?.role === 'WORKER' ? '/dashboard/worker' : '/signup?role=worker'

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F4F8FF_0%,#FFFFFF_30%,#EEF5FF_100%)] text-[#0F172A]">
      <Navbar user={session} />

      <section className="relative overflow-hidden border-b border-[#DCE6F3] text-white">
        <div className="hero-sky absolute inset-0" />
        <div className="hero-orbits absolute inset-0 opacity-70" />
        <div className="hero-stars absolute inset-0 opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,57,0.08)_0%,rgba(7,18,57,0.12)_100%)]" />
        <div className="hero-glow absolute left-[-6%] top-[14%] h-72 w-72 rounded-full bg-white/18 blur-3xl" />
        <div className="hero-glow absolute bottom-[-4%] left-[-8%] h-80 w-80 rounded-full bg-[#DCEBFF]/30 blur-3xl" />
        <div className="hero-glow absolute right-[-8%] top-0 h-96 w-96 rounded-full bg-[#A5D8FF]/35 blur-3xl" />
        <div className="hero-glow absolute bottom-[-10%] right-[8%] h-72 w-72 rounded-full bg-[#7DD3FC]/16 blur-3xl" />

        <div className="section-shell relative grid items-center gap-14 py-14 md:grid-cols-[0.95fr,1.05fr] md:py-20 lg:py-24">
          <Reveal>
            <div className="max-w-[640px]">
              <h1 className="max-w-[12ch] text-[2.85rem] font-extrabold leading-[0.94] tracking-[-0.065em] text-white sm:text-[3.8rem] md:max-w-[11ch] md:text-[4.8rem]">
                Hire reliable <span className="bg-[linear-gradient(135deg,#B9F4CF_0%,#6FE4F1_100%)] bg-clip-text text-transparent">local help</span> or find quality work without friction.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#DDEAFF] sm:text-lg">
                Daily Helper connects customers and workers through a clean job flow, clear trust signals, and simple local coordination.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={customerCta}
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#3C78EE_0%,#1E58D9_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(15,23,42,0.24)]"
                >
                  <BriefcaseBusiness size={16} />
                  Post a Job
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white px-6 py-3 text-base font-semibold text-[#1D3A70] shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#F8FBFF]"
                >
                  <Search size={16} />
                  Browse Jobs
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:max-w-[44rem] sm:grid-cols-2">
                {[
                  {
                    label: 'Fast posting flow',
                    value: 'Create a job in minutes with clear details and budget guidance.',
                    icon: Zap,
                    tone: 'bg-[linear-gradient(180deg,#60A5FA_0%,#1D4ED8_100%)] text-white',
                  },
                  {
                    label: 'Verified trust signals',
                    value: 'Profiles, reviews, and verification help customers hire with confidence.',
                    icon: ShieldCheck,
                    tone: 'bg-[linear-gradient(180deg,#9AE6F0_0%,#14B8A6_100%)] text-[#0F3B46]',
                  },
                ].map(({ label, value, icon: Icon, tone }) => (
                  <div
                    key={label}
                    className="rounded-[28px] border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(244,248,255,0.9))] p-5 text-[#1D315C] shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-6"
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}>
                      <Icon size={22} />
                    </div>
                    <div className="mt-4 text-[1.35rem] font-bold tracking-[-0.04em]">{label}</div>
                    <div className="mt-2 text-sm leading-7 text-[#5A6784] sm:text-base">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <MarketplacePreview />
          </Reveal>
        </div>
      </section>

      <section className="section-shell -mt-8 pt-0 md:-mt-12">
        <Reveal>
          <div className="landing-aurora relative overflow-hidden rounded-[38px] border border-white/70 px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:px-8 md:py-8">
            <div className="float-soft absolute -left-12 top-10 h-32 w-32 rounded-full bg-[#DBEAFE]/80 blur-3xl" />
            <div className="float-soft-delay absolute right-10 top-0 h-28 w-28 rounded-full bg-[#CCFBF1]/70 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[0.88fr,1.12fr] lg:items-center">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Marketplace system</p>
                <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-4xl">
                  A calmer hiring experience designed around clarity, trust, and mobile speed.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#64748B] md:text-base">
                  The homepage now frames Daily Helper as a modern local marketplace rather than a list of isolated features. Every section reinforces trust, local relevance, and a clean job lifecycle.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {platformSignals.map(({ icon: Icon, label, value }, index) => (
                  <Reveal key={label} delay={(index % 4) as 0 | 1 | 2 | 3} className="h-full">
                    <div className="h-full rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0FE] text-[#1D4ED8]">
                        <Icon size={20} />
                      </div>
                      <div className="mt-4 text-lg font-bold tracking-[-0.03em] text-[#0F172A]">{label}</div>
                      <p className="mt-2 text-sm leading-7 text-[#64748B]">{value}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-shell pt-6 md:pt-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Two clear paths</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-4xl">
                Distinct customer and worker flows, without mixing their priorities.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="max-w-2xl text-sm leading-7 text-[#64748B] md:text-base">
              Customers need speed and confidence. Workers need visibility, local opportunities, and a profile that feels credible. The landing page now makes those lanes explicit.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              label: 'For customers',
              title: 'Post once, review clearly, and hire without chaos.',
              description: 'Create a clean brief, compare nearby applicants with trust signals, and unlock contact only when you are ready to move forward.',
              points: [
                'Clear mobile-first posting with budget and timing context.',
                'Visible profile signals before shortlisting a worker.',
                'Structured next steps after hiring intent is real.',
              ],
              icon: BriefcaseBusiness,
              href: customerCta,
              cta: 'Post a Job',
              surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F8FF_100%)]',
              border: 'border-[#D8E5F8]',
              accent: 'bg-[#DBEAFE] text-[#1D4ED8]',
              glow: 'bg-[#BFDBFE]/80',
            },
            {
              label: 'For workers',
              title: 'Build trust, find local gigs, and respond with clarity.',
              description: 'Workers get a cleaner storefront for services, location, verification status, and completed-job feedback so customers know what they are reviewing.',
              points: [
                'Profiles that surface services, area, and reputation clearly.',
                'Local job discovery that respects practical distance.',
                'A marketplace experience that feels more credible than casual.',
              ],
              icon: UserCheck,
              href: workerCta,
              cta: 'Find Work',
              surface: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#F1FFFC_100%)]',
              border: 'border-[#CDEEE8]',
              accent: 'bg-[#CCFBF1] text-[#0F766E]',
              glow: 'bg-[#99F6E4]/80',
            },
          ].map(({ label, title, description, points, icon: Icon, href, cta, surface, border, accent, glow }, index) => (
            <Reveal key={label} delay={index as 0 | 1}>
              <div className={`relative overflow-hidden rounded-[34px] border ${border} ${surface} p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-7`}>
                <div className={`float-soft absolute -right-10 top-4 h-28 w-28 rounded-full ${glow} blur-3xl`} />
                <div className="relative">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">{label}</p>
                      <h3 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#0F172A]">{title}</h3>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#64748B] md:text-base">{description}</p>

                  <div className="mt-6 space-y-3">
                    {points.map(point => (
                      <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/70 bg-white/75 p-4">
                        <CheckCircle2 size={18} className="mt-0.5 text-[#22C55E]" />
                        <p className="text-sm leading-6 text-[#475569]">{point}</p>
                      </div>
                    ))}
                  </div>

                  <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8] transition hover:text-[#1739A7]">
                    {cta}
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-[40px] border border-[#17306F] bg-[linear-gradient(135deg,#0C1737_0%,#112758_52%,#1F4ED8_100%)] px-6 py-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] md:px-8 lg:px-10">
            <div className="hero-stars absolute inset-0 opacity-20" />
            <div className="landing-sheen absolute inset-0 opacity-35" />
            <div className="hero-glow absolute left-8 top-8 h-32 w-32 rounded-full bg-[#60A5FA]/30 blur-3xl" />
            <div className="hero-glow absolute bottom-0 right-8 h-40 w-40 rounded-full bg-[#2DD4BF]/20 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[0.8fr,1.2fr] lg:items-center">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">How it works</p>
                <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-white md:text-4xl">
                  The product stays simple by making the next action obvious at every stage.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 md:text-base">
                  The redesigned landing flow shows the job lifecycle more clearly: publish the brief, review the right people, then connect when hiring intent is real. That clarity is part of the product, not just the marketing.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    'Manual verification',
                    'Protected contact unlock',
                    'Status-led job progression',
                  ].map(item => (
                    <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {workflowSteps.map(({ icon: Icon, step, title, desc }, index) => (
                  <Reveal key={step} delay={index as 0 | 1 | 2}>
                    <div className="h-full rounded-[30px] border border-white/12 bg-white/8 p-5 backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">{step}</span>
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                          <Icon size={18} />
                        </div>
                      </div>
                      <h3 className="mt-6 text-xl font-bold tracking-[-0.03em] text-white">{title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-200">{desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Popular categories</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-4xl">
                Everyday services presented as practical, local, and easy to scan.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="max-w-2xl text-sm leading-7 text-[#64748B] md:text-base">
              The category grid is now more visual and intentional, with stronger surfaces, clearer icon treatment, and a faster path into nearby jobs.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.length === 0 ? (
            <Reveal>
              <div className="rounded-[32px] border border-[#DCE6F3] bg-white p-8 text-sm text-[#64748B] shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                Categories will appear here after they are configured in the database.
              </div>
            </Reveal>
          ) : (
            categories.map((category, index) => {
              const Icon = categoryIcons[category.slug] || BriefcaseBusiness
              const surface = categorySurfaces[index % categorySurfaces.length]

              return (
                <Reveal key={category.id} delay={(index % 4) as 0 | 1 | 2 | 3} className="h-full">
                  <Link
                    href={`/jobs?category=${category.slug}`}
                    className={`group relative flex h-full min-h-[210px] overflow-hidden rounded-[32px] border ${surface.border} ${surface.surface} p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(15,23,42,0.08)]`}
                  >
                    <div className={`float-soft absolute -right-8 top-5 h-24 w-24 rounded-full ${surface.glow} blur-3xl`} />
                    <div className="relative flex h-full flex-col">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${surface.icon} shadow-[0_12px_28px_rgba(15,23,42,0.08)]`}>
                        <Icon size={22} />
                      </div>
                      <div className="mt-auto">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">Local service</div>
                        <div className="mt-2 text-xl font-bold tracking-[-0.03em] text-[#0F172A]">{category.name}</div>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
                          Explore jobs
                          <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )
            })
          )}
        </div>
      </section>

      <section className="section-shell">
        <Reveal>
          <div className="landing-aurora relative overflow-hidden rounded-[40px] border border-[#DCE6F3] px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.07)] md:px-8">
            <div className="float-soft absolute left-[-2rem] top-12 h-28 w-28 rounded-full bg-[#DBEAFE]/80 blur-3xl" />
            <div className="float-soft-delay absolute right-6 bottom-8 h-24 w-24 rounded-full bg-[#CCFBF1]/70 blur-3xl" />

            <div className="relative">
              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <Reveal>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Open jobs</p>
                    <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-4xl">
                      Recent opportunities that make the marketplace feel active right now.
                    </h2>
                  </div>
                </Reveal>
                <Reveal delay={1}>
                  <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8] transition hover:text-[#1739A7]">
                    Browse all jobs
                    <ArrowRight size={15} />
                  </Link>
                </Reveal>
              </div>

              {recentJobs.length === 0 ? (
                <Reveal>
                  <div className="rounded-[30px] border border-white/70 bg-white/85 p-8 text-sm text-[#64748B] shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                    No jobs are live yet. Customers can publish the first listing from the signup flow.
                  </div>
                </Reveal>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {recentJobs.map((job, index) => (
                    <Reveal key={job.id} delay={(index % 2) as 0 | 1} className="h-full">
                      <LandingJobCard job={job} index={index} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-shell pt-0">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Trusted workers</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[#0F172A] md:text-4xl">
                Profiles that help customers decide faster and with more confidence.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <Link href={workerCta} className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D4ED8] transition hover:text-[#1739A7]">
              Build a worker profile
              <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        {trustedWorkers.length === 0 ? (
          <Reveal>
            <div className="rounded-[32px] border border-[#DCE6F3] bg-white p-8 text-sm text-[#64748B] shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
              Trusted worker profiles will appear here as verification requests are approved.
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {trustedWorkers.map((worker, index) => (
              <Reveal key={worker.id} delay={(index % 3) as 0 | 1 | 2} className="h-full">
                <LandingWorkerCard
                  index={index}
                  worker={{
                    ...worker,
                    id: worker.user.id,
                  }}
                />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="section-shell pt-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[42px] border border-[#17306F] bg-[linear-gradient(135deg,#0C1737_0%,#12337B_52%,#2D74F2_100%)] px-6 py-10 text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] md:px-8">
            <div className="hero-stars absolute inset-0 opacity-25" />
            <div className="landing-sheen absolute inset-0 opacity-35" />
            <div className="hero-glow absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-[#93C5FD]/25 blur-3xl" />
            <div className="hero-glow absolute right-0 top-0 h-44 w-44 rounded-full bg-[#5EEAD4]/18 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Start now</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-white md:text-4xl">
                  A local hiring platform that feels modern, calm, and trustworthy on a phone.
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-200 md:text-base">
                  Whether you need help this week or want to find reliable gig work, Daily Helper now presents the product with stronger hierarchy, cleaner trust cues, and motion that feels deliberate rather than noisy.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={session ? '/jobs' : '/signup'}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-[#1D4ED8] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <BriefcaseBusiness size={16} />
                  {session ? 'Browse Jobs' : 'Create Account'}
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-6 py-3 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/12"
                >
                  <Star size={16} />
                  Explore Marketplace
                </Link>
              </div>
            </div>

            <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Trust-first signals', icon: BadgeCheck },
                { label: 'Protected contact flow', icon: ShieldCheck },
                { label: 'Mobile-ready coordination', icon: Sparkles },
              ].map(({ label, icon: Icon }, index) => (
                <Reveal key={label} delay={index as 0 | 1 | 2}>
                  <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <Icon size={18} />
                      </div>
                      <div className="text-sm font-semibold text-white">{label}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}
