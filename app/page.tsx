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
import { JobCard } from '@/components/jobs/JobCard'
import { WorkerCard } from '@/components/workers/WorkerCard'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FadeUp, StaggerChildren, StaggerItem } from '@/components/marketing/MotionSection'
import { Reveal } from '@/components/marketing/Reveal'

const categoryIcons: Record<string, LucideIcon> = {
  cleaning: Sparkles,
  gardening: Flower2,
  moving: BriefcaseBusiness,
  plumbing: Wrench,
  handyman: Hammer,
  repairs: Drill,
}

const categoryGradients = [
  'from-brand-500/10 to-brand-600/5 border-brand-100 group-hover:border-brand-300',
  'from-sage-500/10 to-sage-600/5 border-sage-100 group-hover:border-sage-300',
  'from-accent-500/10 to-accent-600/5 border-accent-100 group-hover:border-accent-300',
  'from-orange-500/10 to-orange-600/5 border-orange-100 group-hover:border-orange-300',
  'from-brand-500/10 to-brand-600/5 border-brand-100 group-hover:border-brand-300',
  'from-sage-500/10 to-sage-600/5 border-sage-100 group-hover:border-sage-300',
  'from-accent-500/10 to-accent-600/5 border-accent-100 group-hover:border-accent-300',
  'from-orange-500/10 to-orange-600/5 border-orange-100 group-hover:border-orange-300',
]

const iconColors = [
  'bg-brand-100 text-brand-600 group-hover:bg-brand-500 group-hover:text-white',
  'bg-sage-100 text-sage-600 group-hover:bg-sage-500 group-hover:text-white',
  'bg-accent-100 text-accent-600 group-hover:bg-accent-500 group-hover:text-white',
  'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white',
  'bg-brand-100 text-brand-600 group-hover:bg-brand-500 group-hover:text-white',
  'bg-sage-100 text-sage-600 group-hover:bg-sage-500 group-hover:text-white',
  'bg-accent-100 text-accent-600 group-hover:bg-accent-500 group-hover:text-white',
  'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white',
]

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
    <div className="min-h-screen bg-[#faf9f6] text-earth-900">
      <Navbar user={session} />

      {/* ── HERO ── */}
      <HeroSection session={session} />

      {/* ── STATS STRIP ── */}
      <div className="border-y border-earth-100 bg-white">
        <div className="section-shell py-10 md:py-12">
          <StaggerChildren className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: '500+', label: 'Jobs Posted', icon: BriefcaseBusiness, color: 'text-brand-500' },
              { value: '200+', label: 'Verified Workers', icon: ShieldCheck, color: 'text-sage-500' },
              { value: '98%', label: 'Satisfaction Rate', icon: Star, color: 'text-neon-amber' },
              { value: '24h', label: 'Avg. Response Time', icon: Zap, color: 'text-accent-500' },
            ].map(({ value, label, icon: Icon, color }) => (
              <StaggerItem key={label}>
                <div className="flex flex-col items-center gap-2 text-center">
                  <Icon size={22} className={color} aria-hidden="true" />
                  <div className="text-3xl font-black tracking-tight text-earth-950">{value}</div>
                  <div className="text-sm font-medium text-earth-500">{label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section-shell">
        <div className="mb-14 text-center">
          <FadeUp>
            <div className="kicker mb-3">Why Daily Helper</div>
            <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight text-earth-950 md:text-5xl">
              Built for real local work,<br />
              <span className="text-gradient">not just any gig platform.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-earth-500">
              Every feature is designed to make local hiring feel safe, fast, and professional.
            </p>
          </FadeUp>
        </div>

        <StaggerChildren className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BadgeCheck,
              title: 'Trust-first',
              desc: 'Verification and review signals support safer hiring decisions.',
              gradient: 'from-brand-500/10 via-brand-500/5 to-transparent',
              iconBg: 'bg-brand-100 text-brand-600',
            },
            {
              icon: Sparkles,
              title: 'Mobile-first',
              desc: 'Designed for quick posting and browsing right from your phone.',
              gradient: 'from-accent-500/10 via-accent-500/5 to-transparent',
              iconBg: 'bg-accent-100 text-accent-600',
            },
            {
              icon: MapPin,
              title: 'Local by design',
              desc: 'Short-distance work with clear location context every time.',
              gradient: 'from-sage-500/10 via-sage-500/5 to-transparent',
              iconBg: 'bg-sage-100 text-sage-600',
            },
            {
              icon: Users,
              title: 'Structured flow',
              desc: 'From posting to contact unlock — every step is clear and safe.',
              gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
              iconBg: 'bg-orange-100 text-orange-600',
            },
          ].map(({ icon: Icon, title, desc, gradient, iconBg }) => (
            <StaggerItem key={title}>
              <div className={`group h-full rounded-3xl border border-earth-100 bg-gradient-to-br p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${gradient}`}>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${iconBg}`}>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-earth-900">{title}</h3>
                <p className="text-sm leading-relaxed text-earth-500">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative overflow-hidden border-y border-earth-100 bg-earth-950 py-20 md:py-28">
        {/* BG decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-600/20 blur-[80px]" />
          <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-emerald-600/15 blur-[80px]" />
          <div className="hero-grid absolute inset-0 opacity-10" />
        </div>

        <div className="section-shell relative">
          <div className="mb-14 text-center">
            <FadeUp>
              <div className="kicker mb-3 text-brand-400">How it works</div>
              <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight text-white md:text-5xl">
                Three steps to get the job done.
              </h2>
            </FadeUp>
          </div>

          <StaggerChildren className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: BriefcaseBusiness,
                title: 'Post the job',
                desc: 'Describe the work, timing, area, and budget in a clear, mobile-first form. Done in under 2 minutes.',
                accent: 'border-brand-500/30 bg-brand-500/10',
                iconBg: 'bg-brand-500/20 text-brand-300',
              },
              {
                step: '02',
                icon: Users,
                title: 'Review applicants',
                desc: 'Compare profiles, ratings, verification, and local relevance before selecting your worker.',
                accent: 'border-sage-500/30 bg-sage-500/10',
                iconBg: 'bg-sage-500/20 text-sage-300',
              },
              {
                step: '03',
                icon: CreditCard,
                title: 'Unlock & coordinate',
                desc: 'Pay the connection fee and reveal contact details after admin approval. Safe by design.',
                accent: 'border-accent-500/30 bg-accent-500/10',
                iconBg: 'bg-accent-500/20 text-accent-300',
              },
            ].map(({ step, icon: Icon, title, desc, accent, iconBg }, i) => (
              <StaggerItem key={title}>
                <div className={`relative h-full rounded-3xl border p-7 ${accent}`}>
                  <div className="absolute right-5 top-5 text-5xl font-black leading-none text-white/5">{step}</div>
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-white/55">{desc}</p>
                  {i < 2 && (
                    <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block">
                      <ArrowRight size={20} className="text-white/20" />
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section-shell">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <FadeUp>
            <div>
              <div className="kicker mb-3">Categories</div>
              <h2 className="text-3xl font-black tracking-tight text-earth-950 md:text-4xl">
                Services people need <br className="hidden md:block" />
                <span className="text-gradient">every single week.</span>
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-earth-500">
              From household cleaning to plumbing repairs — browse by category to find the right type of help.
            </p>
          </FadeUp>
        </div>

        <StaggerChildren className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.slug] || BriefcaseBusiness
            return (
              <StaggerItem key={category.id}>
                <Link
                  href={`/jobs?category=${category.slug}`}
                  aria-label={`Browse ${category.name} jobs`}
                  className={`group flex min-h-[140px] flex-col rounded-3xl border bg-gradient-to-br p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${categoryGradients[index % categoryGradients.length]}`}
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${iconColors[index % iconColors.length]}`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <div className="mt-auto">
                    <div className="text-sm font-bold text-earth-900">{category.name}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-earth-400 transition-colors group-hover:text-brand-500">
                      Browse <ArrowRight size={10} />
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerChildren>
      </section>

      {/* ── TRUST SECTION ── */}
      <section className="border-y border-earth-100 bg-white">
        <div className="section-shell">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <FadeUp>
              <div>
                <div className="kicker mb-3">Trust & Safety</div>
                <h2 className="mb-4 text-3xl font-black tracking-tight text-earth-950 md:text-4xl">
                  Designed to feel reliable, <br />
                  <span className="text-gradient-teal">not casual.</span>
                </h2>
                <p className="mb-8 text-base leading-relaxed text-earth-500">
                  Verification, reviews, and protected communication reduce uncertainty and help both sides understand what happens next.
                </p>

                <div className="space-y-3">
                  {[
                    'Trusted badges appear only after manual review by an admin.',
                    'Worker ratings come from completed jobs — not self-reported claims.',
                    'Contact details stay private until a customer is ready to connect.',
                    'Status-driven screens make every action easy to follow on mobile.',
                  ].map((item, i) => (
                    <FadeUp key={item} delay={i * 0.08}>
                      <div className="flex items-start gap-3 rounded-2xl border border-earth-100 bg-earth-50 p-4">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sage-500" aria-hidden="true" />
                        <p className="text-sm leading-relaxed text-earth-600">{item}</p>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.2} direction="right">
              <div className="relative mx-auto w-full max-w-md">
                {/* Decoration */}
                <div className="absolute -left-8 -top-8 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
                <div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-sage-500/10 blur-3xl" />

                <div className="relative space-y-4">
                  {/* Trust card */}
                  <div className="rounded-3xl border border-earth-200 bg-white p-6 shadow-card">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 text-sage-600">
                        <BadgeCheck size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-earth-900">Trusted Worker Profile</p>
                        <p className="text-sm text-earth-500">Visible after verification</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['Identity review', 'Manual process'],
                        ['Reputation', 'Real reviews'],
                        ['Privacy', 'Protected contact'],
                        ['Clarity', 'Job progression'],
                      ].map(([label, val]) => (
                        <div key={label} className="rounded-2xl bg-earth-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-earth-400">{label}</p>
                          <p className="mt-1 text-sm font-semibold text-earth-800">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dark panel */}
                  <div className="rounded-3xl bg-earth-950 p-6 text-white">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Platform principle</span>
                      <ShieldCheck size={18} className="text-sage-400" />
                    </div>
                    <p className="text-sm leading-relaxed text-white/70">
                      Fast local hiring that feels credible, less chaotic, and easy to understand on a phone.
                    </p>

                    {/* Worker avatars */}
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {['K', 'T', 'M', 'B'].map((letter, i) => (
                          <div
                            key={letter}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-earth-900 text-xs font-bold"
                            style={{ background: ['#d97706', '#16a34a', '#f43f5e', '#b45309'][i] }}
                          >
                            {letter}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-white/50">
                        <span className="font-bold text-white">200+</span> verified workers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── RECENT JOBS ── */}
      <section className="section-shell">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <FadeUp>
            <div>
              <div className="kicker mb-3">Open Jobs</div>
              <h2 className="text-3xl font-black tracking-tight text-earth-950 md:text-4xl">
                Opportunities posted right now.
              </h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 transition-colors hover:text-brand-800">
              Browse all jobs
              <ArrowRight size={15} />
            </Link>
          </FadeUp>
        </div>

        {recentJobs.length === 0 ? (
          <FadeUp>
            <div className="rounded-3xl border border-earth-100 bg-white p-10 text-center text-sm text-earth-500 shadow-card">
              No jobs live yet. Be the first to post.
            </div>
          </FadeUp>
        ) : (
          <StaggerChildren className="grid gap-4 md:grid-cols-2">
            {recentJobs.map(job => (
              <StaggerItem key={job.id}>
                <JobCard job={job} />
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </section>

      {/* ── TRUSTED WORKERS ── */}
      {trustedWorkers.length > 0 && (
        <section className="border-t border-earth-100 bg-white">
          <div className="section-shell">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <FadeUp>
                <div>
                  <div className="kicker mb-3">Trusted Workers</div>
                  <h2 className="text-3xl font-black tracking-tight text-earth-950 md:text-4xl">
                    Profiles customers hire<br />
                    <span className="text-gradient">with confidence.</span>
                  </h2>
                </div>
              </FadeUp>
              <FadeUp delay={0.1}>
                <Link href="/signup?role=worker" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 transition-colors hover:text-brand-800">
                  Build a worker profile
                  <ArrowRight size={15} />
                </Link>
              </FadeUp>
            </div>

            <StaggerChildren className="grid gap-4 md:grid-cols-3">
              {trustedWorkers.map(worker => (
                <StaggerItem key={worker.id}>
                  <WorkerCard worker={{ ...worker, id: worker.user.id }} />
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section className="section-shell">
        <FadeUp>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-earth-950 p-10 md:p-14">
            {/* BG decoration */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-600/25 blur-[80px]" />
              <div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-emerald-600/20 blur-[80px]" />
              <div className="hero-grid absolute inset-0 opacity-10" />
            </div>

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="kicker mb-3 text-brand-400">Start now</div>
                <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                  Modern, calm, and trustworthy —<br />local hiring done right.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/55">
                  Whether you need help today or want to find reliable gig work, Daily Helper keeps the process direct and professional.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href={session ? '/jobs' : '/signup'}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-brand-500 px-7 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-glow-lg"
                >
                  <BriefcaseBusiness size={16} />
                  {session ? 'Browse Jobs' : 'Create Account'}
                </Link>
                <Link
                  href="/jobs"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-7 text-sm font-bold text-white transition-all hover:bg-white/15"
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
        </FadeUp>
      </section>

      <Footer />
    </div>
  )
}
