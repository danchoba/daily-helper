'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BadgeCheck, Clock3, MapPin } from 'lucide-react'

const mockJobs = [
  { title: 'House Cleaning Needed', area: 'Gaborone West', budget: 'BWP 350', badge: 'Cleaning', time: '12m ago' },
  { title: 'Gardening Help in Broadhurst', area: 'Broadhurst', budget: 'BWP 420', badge: 'Gardening', time: '38m ago' },
  { title: 'Cleaning Help in Gaphatwe', area: 'Gaphatwe', budget: 'BWP 280', badge: 'Cleaning', time: '1hr ago' },
  { title: 'Errand Help Nearby', area: 'CBD', budget: 'BWP 180', badge: 'Errands', time: '5m ago' },
]

interface HeroSectionProps {
  session: { role: string } | null
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] pb-14 pt-10 md:pb-20 md:pt-16">
      {/* Warm ambient glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-amber-100/80 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-orange-50 blur-[100px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-[1.1fr_0.9fr] md:px-6">
        {/* ── Left: Copy ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-7"
        >
          <div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-earth-950 md:text-[58px]">
              Get Local Help,<br />On-Demand
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-earth-500">
              Find trusted local workers for your everyday tasks in minutes.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-7 text-sm font-bold text-white shadow-glow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-glow"
            >
              Post a Job
            </Link>
            <Link
              href={session?.role === 'WORKER' ? '/dashboard/worker' : '/signup?role=worker'}
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-earth-200 bg-white px-7 text-sm font-bold text-earth-800 transition-all hover:-translate-y-0.5 hover:border-earth-300 hover:bg-earth-50"
            >
              Become a Worker
            </Link>
          </div>
        </motion.div>

        {/* ── Right: Phone mockups ── */}
        <div className="relative hidden h-[480px] md:block">
          {/* Background circle */}
          <div className="absolute right-4 top-1/2 h-[340px] w-[340px] -translate-y-1/2 rounded-full bg-amber-100/90 border border-amber-200/60" />

          {/* Back phone — tilted right */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[0%] top-[4%] w-[205px] rotate-[6deg]"
          >
            <PhoneFrame jobs={mockJobs.slice(0, 2)} />
          </motion.div>

          {/* Front phone — tilted left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[0%] top-[12%] w-[205px] -rotate-[4deg]"
          >
            <PhoneFrame jobs={mockJobs.slice(1, 3)} />
          </motion.div>

          {/* Floating verified worker chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[6%] right-[10%] flex items-center gap-2.5 rounded-2xl border border-earth-100 bg-white px-4 py-3 shadow-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-amber-700">
              K
            </div>
            <div>
              <p className="text-xs font-bold text-earth-900">Kgosi R.</p>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-sage-600">
                <BadgeCheck size={10} />
                Verified Worker
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function PhoneFrame({ jobs }: { jobs: typeof mockJobs }) {
  return (
    <div className="overflow-hidden rounded-[26px] border-[3px] border-earth-800 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.14)]">
      {/* Status bar */}
      <div className="bg-earth-900 px-4 py-2 text-center">
        <p className="text-[11px] font-bold tracking-wider text-white/60">Daily Helper</p>
      </div>
      {/* Job cards */}
      <div className="space-y-2 bg-[#faf8f5] p-3">
        {jobs.map((job, i) => (
          <div key={i} className="rounded-xl border border-earth-100 bg-white p-3 shadow-sm">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                {job.badge}
              </span>
              <span className="flex items-center gap-0.5 text-[9px] text-earth-400">
                <Clock3 size={7} />
                {job.time}
              </span>
            </div>
            <p className="text-[11px] font-bold leading-tight text-earth-900">{job.title}</p>
            <div className="mt-1 flex items-center gap-1 text-[9px] text-earth-400">
              <MapPin size={8} />
              {job.area}
            </div>
            <p className="mt-1.5 text-[12px] font-black text-earth-900">{job.budget}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
