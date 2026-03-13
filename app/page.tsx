import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
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
  type LucideIcon,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { WorkerCard } from '@/components/workers/WorkerCard'
import { Reveal } from '@/components/marketing/Reveal'
import { MarketplacePreview } from '@/components/marketing/MarketplacePreview'

const categoryIcons: Record<string, LucideIcon> = {
  cleaning: Sparkles,
  gardening: Flower2,
  moving: BriefcaseBusiness,
  plumbing: Wrench,
  handyman: Hammer,
  repairs: Drill,
}

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

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <Navbar user={session} />

      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-[linear-gradient(135deg,#1F4ED8_0%,#1739A7_55%,#102A75_100%)] text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="hero-glow absolute left-[-5%] top-10 h-64 w-64 rounded-full bg-[#60A5FA]/30 blur-3xl" />
        <div className="hero-glow absolute bottom-0 right-[-2%] h-72 w-72 rounded-full bg-[#14B8A6]/25 blur-3xl" />

        <div className="section-shell relative grid items-center gap-12 py-16 md:grid-cols-[1.05fr,0.95fr] md:py-24">
          <Reveal>
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100 backdrop-blur">
                <ShieldCheck size={14} />
                Trusted local marketplace for everyday work
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-6xl">
                Hire nearby help or find your next micro-gig with clarity.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-blue-100 md:text-lg">
                Daily Helper connects customers and workers through a mobile-first marketplace built for trust, simple workflows, and fast local coordination.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1F4ED8] shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(15,23,42,0.2)]"
                >
                  <BriefcaseBusiness size={16} />
                  Post a job
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Search size={16} />
                  Browse jobs
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { icon: UserCheck, text: 'Verified worker profiles' },
                  { icon: ClipboardList, text: 'Simple posting and application flow' },
                  { icon: CreditCard, text: 'Protected contact unlock process' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-blue-50 backdrop-blur">
                    <Icon size={14} />
                    {text}
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

      <section className="section-shell py-12 md:py-14">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: BadgeCheck,
                title: 'Trust-first marketplace',
                desc: 'Verification, ratings, and contact protection help customers hire with more confidence.',
              },
              {
                icon: MapPin,
                title: 'Built for local work',
                desc: 'Short-distance jobs, practical services, and quick coordination for nearby tasks.',
              },
              {
                icon: Users,
                title: 'Clear two-sided workflow',
                desc: 'Customers post and review applicants while workers apply through a focused mobile flow.',
              },
            ].map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} delay={index as 0 | 1 | 2}>
                <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#1F4ED8] transition duration-200 group-hover:bg-[#1F4ED8] group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-lg font-bold tracking-tight text-[#0F172A]">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="section-shell border-y border-[#E2E8F0] bg-white">
        <div className="grid gap-10 md:grid-cols-[0.95fr,1.05fr] md:items-center">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">How it works</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                A fast, structured path from posting to hiring.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#64748B]">
                The product keeps the interaction straightforward: define the job, review credible applicants, then unlock contact details only when you are ready to proceed.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: ClipboardList,
                    title: '1. Post a clear job',
                    desc: 'Describe the task, timing, budget, and location so workers can evaluate it quickly.',
                  },
                  {
                    icon: Users,
                    title: '2. Review applicants',
                    desc: 'Compare profiles, ratings, trust indicators, and service area before shortlisting.',
                  },
                  {
                    icon: CreditCard,
                    title: '3. Unlock and coordinate',
                    desc: 'Reveal the selected worker’s contact details once payment confirmation is complete.',
                  },
                ].map(({ icon: Icon, title, desc }, index) => (
                  <Reveal key={title} delay={index as 0 | 1 | 2}>
                    <div className="flex gap-4 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#1F4ED8]">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-[#0F172A]">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-[#64748B]">{desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="relative mx-auto w-full max-w-[520px] rounded-[32px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF6FF_100%)] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-x-8 top-8 h-px bg-[linear-gradient(90deg,transparent,#BFDBFE,transparent)]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#1F4ED8]">
                    <BriefcaseBusiness size={18} />
                  </div>
                  <h3 className="font-bold tracking-tight text-[#0F172A]">Customer dashboard</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    Organize active jobs, applicant queues, and payment steps in one place.
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#14B8A6]">
                    <UserCheck size={18} />
                  </div>
                  <h3 className="font-bold tracking-tight text-[#0F172A]">Worker profile</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    Show services, area, trust status, and reviews in a clean hiring view.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-[#E2E8F0] bg-[#0F172A] p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">Hiring confidence</p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight">Trusted profile signals</h3>
                  </div>
                  <ShieldCheck size={22} className="text-[#14B8A6]" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Identity review', 'Admin-verified badge'],
                    ['Real job reviews', 'Feedback from completed work'],
                    ['Protected details', 'Contact unlocked only after payment'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-300">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Categories</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Common job types on Daily Helper
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="max-w-xl text-sm leading-7 text-[#64748B]">
              Customers can publish practical local tasks across household, errands, and maintenance categories.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug] || BriefcaseBusiness
            return (
              <Reveal key={category.id} delay={(index % 4) as 0 | 1 | 2 | 3}>
                <Link
                  href={`/jobs?category=${category.slug}`}
                  className="group rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1F4ED8] transition duration-200 group-hover:bg-[#1F4ED8] group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <div className="text-sm font-semibold text-[#0F172A]">{category.name}</div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="section-shell border-y border-[#E2E8F0] bg-white">
        <div className="grid gap-10 md:grid-cols-[0.95fr,1.05fr] md:items-center">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Trust and verification</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Professional trust signals built into the product.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#64748B]">
                Verification, reviews, and protected communication reduce uncertainty for both sides of the marketplace.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  'Trusted badges appear only after manual verification review.',
                  'Ratings come from completed jobs, not self-reported claims.',
                  'Worker contact details stay private until there is real intent to hire.',
                  'Status-driven dashboards make each next step easier to understand.',
                ].map((item, index) => (
                  <Reveal key={item} delay={index as 0 | 1 | 2 | 3}>
                    <div className="flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <CheckCircle2 size={18} className="mt-0.5 text-[#22C55E]" />
                      <p className="text-sm leading-6 text-[#475569]">{item}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[32px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_100%)] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="absolute left-[-40px] top-[-40px] h-32 w-32 rounded-full bg-[#1F4ED8]/10 blur-2xl" />
              <div className="absolute bottom-[-30px] right-[-20px] h-28 w-28 rounded-full bg-[#14B8A6]/10 blur-2xl" />
              <div className="relative">
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#22C55E]">
                      <BadgeCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0F172A]">Trusted worker profile</p>
                      <p className="text-sm text-[#64748B]">Visible after verification approval</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Verification</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">Manual identity review</p>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Reputation</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">Review-based trust</p>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Privacy</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">Controlled contact unlock</p>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Clarity</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">Visible job progress</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Marketplace activity</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Recent open opportunities
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F4ED8] transition hover:text-[#1739A7]">
              Browse all jobs
              <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        {recentJobs.length === 0 ? (
          <Reveal>
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 text-sm text-[#64748B] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              No jobs are live yet. Customers can publish the first listing from the signup flow.
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentJobs.map((job, index) => (
              <Reveal key={job.id} delay={(index % 2) as 0 | 1}>
                <JobCard job={job} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="section-shell border-t border-[#E2E8F0] bg-white">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Worker quality</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Trusted workers on the platform
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <Link href="/signup?role=worker" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F4ED8] transition hover:text-[#1739A7]">
              Build a worker profile
              <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>

        {trustedWorkers.length === 0 ? (
          <Reveal>
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 text-sm text-[#64748B] shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
              Trusted worker profiles will appear here as verification requests are approved.
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {trustedWorkers.map((worker, index) => (
              <Reveal key={worker.id} delay={(index % 3) as 0 | 1 | 2}>
                <WorkerCard
                  worker={{
                    ...worker,
                    id: worker.user.id,
                  }}
                />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={2}>
          <div className="mt-12 rounded-[32px] bg-[#0F172A] px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">Get started</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white">
                  A local marketplace designed to feel credible and easy to use.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Whether you need help today or want to find reliable gig work, Daily Helper keeps the process direct and professional.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={session ? '/jobs' : '/signup'}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#1F4ED8] px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#1739A7]"
                >
                  <BriefcaseBusiness size={16} />
                  {session ? 'Browse jobs' : 'Create account'}
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Star size={16} />
                  Explore the marketplace
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}
