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

      <section className="relative overflow-hidden border-b border-[#DCE6F3] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_22%),linear-gradient(135deg,#0F2E89_0%,#1F4ED8_45%,#102A75_100%)] text-white">
        <div className="hero-grid absolute inset-0 opacity-35" />
        <div className="hero-glow absolute left-[-2%] top-12 h-64 w-64 rounded-full bg-[#60A5FA]/30 blur-3xl" />
        <div className="hero-glow absolute bottom-2 right-[-4%] h-80 w-80 rounded-full bg-[#14B8A6]/25 blur-3xl" />

        <div className="section-shell relative grid items-center gap-14 py-16 md:grid-cols-[1.02fr,0.98fr] md:py-24">
          <Reveal>
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100 backdrop-blur">
                <ShieldCheck size={14} />
                Professional local marketplace for practical jobs
              </div>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-white md:text-6xl">
                Small local jobs, handled through a cleaner and more trusted workflow.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-blue-100 md:text-lg">
                Customers post jobs, workers apply nearby, and Daily Helper keeps the process organized with verification, reviews, and controlled contact unlocks.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'}
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1F4ED8] shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(15,23,42,0.24)]"
                >
                  <BriefcaseBusiness size={16} />
                  Post a job
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Search size={16} />
                  Browse jobs
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Verified trust', value: 'Manual review and trusted badges' },
                  { label: 'Fast local matching', value: 'Clear nearby job discovery' },
                  { label: 'Protected contact flow', value: 'Unlock only when ready to hire' },
                ].map(item => (
                  <div key={item.label} className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur">
                    <div className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-100">{item.label}</div>
                    <div className="mt-2 text-sm leading-6 text-white/90">{item.value}</div>
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
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Trust-first', value: 'Verification and review signals support safer hiring.', icon: BadgeCheck },
            { label: 'Mobile-first', value: 'Designed for quick posting and browsing on a phone.', icon: Sparkles },
            { label: 'Local by design', value: 'Short-distance work with clear location context.', icon: MapPin },
            { label: 'Simple coordination', value: 'Structured job flow from posting to contact unlock.', icon: Users },
          ].map(({ label, value, icon: Icon }, index) => (
            <Reveal key={label} delay={(index % 4) as 0 | 1 | 2 | 3} className="h-full">
              <div className="group rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#1F4ED8] transition duration-200 group-hover:bg-[#1F4ED8] group-hover:text-white">
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-[#0F172A]">{label}</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748B]">{value}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-shell border-y border-[#E2E8F0] bg-white">
        <div className="grid gap-10 md:grid-cols-[0.9fr,1.1fr] md:items-center">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">How it works</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Built for customers who want speed and workers who need clarity.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#64748B]">
                The product keeps the path simple: publish the task, review applicants with visible trust signals, then unlock contact details when there is real hiring intent.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: BriefcaseBusiness,
                    title: 'Post the job',
                    desc: 'Describe the work, timing, area, and budget in a clear mobile-first form.',
                  },
                  {
                    icon: Users,
                    title: 'Review applicants',
                    desc: 'Compare profiles, ratings, verification, and local relevance before selecting.',
                  },
                  {
                    icon: CreditCard,
                    title: 'Unlock and coordinate',
                    desc: 'Submit payment for the connection fee and reveal contact details after approval.',
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
            <div className="relative mx-auto w-full max-w-[560px] rounded-[34px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#EEF6FF_100%)] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-x-10 top-10 h-px bg-[linear-gradient(90deg,transparent,#BFDBFE,transparent)]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#1F4ED8]">
                    <BriefcaseBusiness size={18} />
                  </div>
                  <h3 className="font-bold tracking-tight text-[#0F172A]">Customer workspace</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    Track active jobs, review applicants, and manage next actions from one dashboard.
                  </p>
                </div>
                <div className="rounded-3xl border border-[#E2E8F0] bg-white p-5">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#CCFBF1] text-[#14B8A6]">
                    <UserCheck size={18} />
                  </div>
                  <h3 className="font-bold tracking-tight text-[#0F172A]">Worker profile</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    Present services, location, verification state, and customer reviews in a clean format.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-[#E2E8F0] bg-[#0F172A] p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">Hiring confidence</p>
                    <h3 className="mt-1 text-xl font-bold tracking-tight">Signals customers can trust</h3>
                  </div>
                  <ShieldCheck size={22} className="text-[#14B8A6]" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Identity review', 'Trusted badge after approval'],
                    ['Verified feedback', 'Ratings tied to completed jobs'],
                    ['Private details', 'Contact stays locked until payment'],
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Popular categories</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Services people actually need every week
              </h2>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="max-w-xl text-sm leading-7 text-[#64748B]">
              Daily Helper is designed for practical, real-world local work across household support, errands, maintenance, and moving help.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug] || BriefcaseBusiness
            return (
              <Reveal key={category.id} delay={(index % 4) as 0 | 1 | 2 | 3} className="h-full">
                <Link
                  href={`/jobs?category=${category.slug}`}
                  className="group flex h-full min-h-[160px] flex-col rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] text-[#1F4ED8] transition duration-200 group-hover:bg-[#1F4ED8] group-hover:text-white">
                    <Icon size={20} />
                  </div>
                  <div className="mt-auto text-sm font-semibold text-[#0F172A]">{category.name}</div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="section-shell border-y border-[#E2E8F0] bg-white">
        <div className="grid gap-10 md:grid-cols-[1fr,1fr] md:items-center">
          <Reveal>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Trust and verification</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                The platform is designed to feel reliable, not casual.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#64748B]">
                Verification, reviews, and protected communication reduce uncertainty and help both sides understand what happens next.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  'Trusted badges appear only after manual review by an admin.',
                  'Worker ratings come from completed jobs rather than self-reported claims.',
                  'Contact details stay private until a customer is ready to connect.',
                  'Status-driven screens make each action easier to follow on mobile.',
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
            <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-[34px] border border-[#E2E8F0] bg-[linear-gradient(180deg,#F8FBFF_0%,#FFFFFF_100%)] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
              <div className="absolute left-[-36px] top-[-32px] h-32 w-32 rounded-full bg-[#1F4ED8]/10 blur-2xl" />
              <div className="absolute bottom-[-24px] right-[-18px] h-28 w-28 rounded-full bg-[#14B8A6]/10 blur-2xl" />
              <div className="relative space-y-4">
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
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">Real customer reviews</p>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Privacy</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">Controlled contact unlock</p>
                    </div>
                    <div className="rounded-2xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Clarity</p>
                      <p className="mt-2 text-sm font-semibold text-[#0F172A]">Visible job progression</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#0F172A] p-5 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-200">Marketplace principle</div>
                  <p className="mt-3 text-base font-semibold leading-7">
                    Daily Helper is structured to make fast local hiring feel more credible, less chaotic, and easier to understand on a phone.
                  </p>
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Open jobs</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Recent opportunities posted right now
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
              <Reveal key={job.id} delay={(index % 2) as 0 | 1} className="h-full">
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#64748B]">Trusted workers</p>
              <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#0F172A] md:text-4xl">
                Profiles that help customers hire with more confidence
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
              <Reveal key={worker.id} delay={(index % 3) as 0 | 1 | 2} className="h-full">
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
          <div className="mt-12 rounded-[34px] bg-[linear-gradient(135deg,#0F172A_0%,#102A75_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-200">Start now</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white">
                  A local hiring experience designed to feel modern, calm, and trustworthy.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Whether you need help today or want to find reliable gig work, Daily Helper keeps the process direct and professional.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={session ? '/jobs' : '/signup'}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#1F4ED8] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <BriefcaseBusiness size={16} />
                  {session ? 'Browse jobs' : 'Create account'}
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Star size={16} />
                  Explore marketplace
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
