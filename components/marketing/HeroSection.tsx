'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BadgeCheck, Clock3, MapPin, Star, ArrowRight, Users, Sparkles } from 'lucide-react'
import type { PlatformStats } from '@/app/page'

interface HeroSectionProps {
  session: { role: string } | null
  stats: PlatformStats
}

export function HeroSection({ session, stats }: HeroSectionProps) {
  const postJobHref = session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'
  const workerHref = session?.role === 'WORKER' ? '/dashboard/worker' : '/signup?role=worker'

  const avgRatingDisplay = stats.avgRating ? `${stats.avgRating.toFixed(1)}★` : '—'
  const verifiedDisplay = stats.verifiedWorkers > 0 ? `${stats.verifiedWorkers.toLocaleString()}+` : '0'
  const completedDisplay = stats.completedJobs > 0 ? `${stats.completedJobs.toLocaleString()}+` : '0'

  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pb-0 pt-14 md:pt-20">
      {/* ── Atmospheric background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[700px] w-[700px] rounded-full bg-amber-200/40 blur-[130px]" />
        <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-orange-100/60 blur-[100px]" />
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,rgba(250,248,245,0.7)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_0.88fr]">

          {/* ── LEFT: Copy ── */}
          <div className="flex flex-col gap-8">
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-[52px] font-black leading-[1.02] tracking-[-0.03em] text-earth-950 md:text-[64px]">
                Get Any Job Done,{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-amber-400 bg-clip-text text-transparent">
                    Near You.
                  </span>
                  <svg
                    className="absolute -bottom-1 left-0 w-full"
                    viewBox="0 0 200 8" preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0,5 Q50,0 100,4 Q150,8 200,3"
                      stroke="url(#heroUnderline)" strokeWidth="3" fill="none" strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="heroUnderline" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d97706" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[480px] text-[17px] leading-[1.65] text-earth-500"
            >
              Post a task, browse verified local workers, and get it done — cleaning, gardening,
              moving, plumbing, and more across Gaborone and beyond.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-3"
            >
              <motion.div whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={postJobHref}
                  className="inline-flex h-[52px] items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-7 text-[15px] font-bold text-white shadow-glow-sm transition-all hover:shadow-glow"
                >
                  <Sparkles size={16} aria-hidden="true" />
                  Post a Job
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={workerHref}
                  className="inline-flex h-[52px] items-center gap-2 rounded-2xl border-2 border-earth-200 bg-white px-7 text-[15px] font-bold text-earth-800 shadow-sm transition-all hover:border-earth-300 hover:bg-earth-50"
                >
                  Find Work
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Live stats from DB */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              {[
                { value: verifiedDisplay, label: 'Verified helpers' },
                { value: completedDisplay, label: 'Jobs completed' },
                { value: avgRatingDisplay, label: 'Avg. rating' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-earth-900">{value}</span>
                  <span className="text-[11px] font-semibold text-earth-400">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Floating UI cards ── */}
          <div className="relative hidden h-[520px] md:block">
            <div className="absolute right-4 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full border border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50/60" />
            <div className="absolute right-20 top-1/2 h-[200px] w-[200px] -translate-y-1/2 rounded-full border border-amber-100/40 bg-transparent" />

            {/* CARD 1: Active job post */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="float-soft absolute left-[0%] top-[6%] w-[230px]"
            >
              <div className="overflow-hidden rounded-2xl border border-earth-100 bg-white shadow-card-hover">
                <div className="border-b border-earth-50 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">Cleaning</span>
                    <span className="flex items-center gap-1 text-[10px] text-earth-400">
                      <Clock3 size={9} />5m ago
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[13px] font-bold leading-snug text-earth-900">House Cleaning in Gaborone West</p>
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-earth-400">
                    <MapPin size={10} />
                    Block 8, Gaborone West
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[18px] font-black text-earth-900">BWP 350</span>
                    <span className="rounded-xl bg-brand-600 px-3 py-1 text-[11px] font-bold text-white">Apply →</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-sage-50 px-2.5 py-1.5">
                    <Users size={11} className="text-sage-600" />
                    <span className="text-[10px] font-semibold text-sage-700">4 workers applied</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 2: Worker profile */}
            <motion.div
              initial={{ opacity: 0, y: 44, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="float-soft-delay absolute right-[2%] top-[22%] w-[210px]"
            >
              <div className="overflow-hidden rounded-2xl border border-earth-100 bg-white shadow-card">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-[15px] font-black text-white">K</div>
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-sage-500">
                        <BadgeCheck size={10} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-earth-900">Kgosi Ramokoka</p>
                      <div className="mt-0.5 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-[10px] font-bold text-earth-500">4.9</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {['Cleaning', 'Handyman'].map(tag => (
                      <span key={tag} className="rounded-lg bg-earth-50 px-2 py-0.5 text-[10px] font-semibold text-earth-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2.5 text-[11px] font-medium text-earth-400">28 jobs · Gaborone</div>
                </div>
              </div>
            </motion.div>

            {/* CARD 3: Completion notification */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="float-slow absolute bottom-[12%] left-[8%] w-[220px]"
            >
              <div className="overflow-hidden rounded-2xl border border-earth-100 bg-white shadow-card">
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                      <BadgeCheck size={16} className="text-sage-600" />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-earth-900">Job Completed!</p>
                      <p className="text-[10px] text-earth-400">Garden Tidy-Up · Tlokweng</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1.5">
                    <span className="text-[10px] font-semibold text-amber-700">⭐ Leave a review</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CARD 4: Live activity pill */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="absolute bottom-[42%] right-[0%] flex items-center gap-2 rounded-full border border-earth-100 bg-white px-3.5 py-2 shadow-card"
            >
              <span className="h-2 w-2 rounded-full bg-sage-500 shadow-[0_0_8px_rgba(22,163,74,0.6)]" />
              <span className="text-[11px] font-bold text-earth-700">Jobs live now</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Trust strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="relative mt-14 border-t border-earth-100/60"
      >
        <div className="mx-auto max-w-6xl px-4 py-5 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-earth-400">Trusted by people across Botswana</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                { icon: BadgeCheck, text: 'ID-Verified Workers', color: 'text-sage-600', bg: 'bg-sage-50' },
                { icon: Star, text: 'Community Ratings', color: 'text-amber-600', bg: 'bg-amber-50' },
                { icon: MapPin, text: 'Gaborone & Beyond', color: 'text-brand-600', bg: 'bg-brand-50' },
              ].map(({ icon: Icon, text, color, bg }) => (
                <div key={text} className={`flex items-center gap-1.5 rounded-full ${bg} px-3 py-1.5`}>
                  <Icon size={12} className={color} />
                  <span className={`text-[11px] font-semibold ${color}`}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
