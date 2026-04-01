'use client'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ArrowRight, BadgeCheck, BriefcaseBusiness, Clock3, MapPin,
  Search, ShieldCheck, Star, Users, Zap,
} from 'lucide-react'

const WORDS = ['Home Tasks', 'Garden Work', 'Moving Help', 'Plumbing Jobs', 'Errands']

function AnimatedWord() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 2400)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-block overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="block bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const floatingCards = [
  {
    title: 'Deep clean 3-bedroom house',
    area: 'Gaborone West',
    budget: 'BWP 350',
    applicants: 7,
    posted: '12 min ago',
    category: 'Cleaning',
    accent: 'from-brand-500/20 to-brand-600/10 border-brand-200',
    dot: 'bg-brand-500',
  },
  {
    title: 'Weekend garden trimming',
    area: 'Broadhurst',
    budget: 'BWP 420',
    applicants: 4,
    posted: '38 min ago',
    category: 'Gardening',
    accent: 'from-sage-500/20 to-sage-600/10 border-sage-200',
    dot: 'bg-sage-500',
  },
  {
    title: 'Document queue assistance',
    area: 'CBD',
    budget: 'BWP 180',
    applicants: 11,
    posted: '5 min ago',
    category: 'Errands',
    accent: 'from-accent-500/20 to-accent-600/10 border-accent-200',
    dot: 'bg-accent-500',
  },
]

function FloatingJobCard({ card, delay, style }: { card: typeof floatingCards[0]; delay: number; style: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className="absolute w-[220px] sm:w-[250px]"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay: delay * 0.5 }}
        className={`rounded-2xl border bg-gradient-to-br p-4 shadow-card ${card.accent}`}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-earth-600">
            {card.category}
          </span>
          <span className="flex h-2 w-2 rounded-full" style={{ background: card.dot.replace('bg-', '').includes('brand') ? '#f59e0b' : card.dot.replace('bg-', '').includes('sage') ? '#22c55e' : '#f43f5e' }}>
            <motion.span
              className={`absolute h-2 w-2 rounded-full opacity-75 ${card.dot}`}
              animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </span>
        </div>
        <p className="mb-3 text-sm font-bold leading-snug text-earth-900">{card.title}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-earth-500">
          <span className="flex items-center gap-1"><MapPin size={10} />{card.area}</span>
          <span className="flex items-center gap-1"><Users size={10} />{card.applicants}</span>
          <span className="flex items-center gap-1"><Clock3 size={10} />{card.posted}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-earth-200/60 pt-2">
          <span className="text-sm font-bold text-earth-900">{card.budget}</span>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-sage-600">
            <BadgeCheck size={11} />Open
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

interface HeroSectionProps {
  session: { role: string } | null
}

export function HeroSection({ session }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
  }

  return (
    <section
      ref={ref}
      className="relative min-h-[90vh] overflow-hidden bg-[#0f0a03]"
      aria-label="Hero"
    >
      {/* ── Animated gradient orbs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-amber-600/25 blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute -right-48 top-0 h-[500px] w-[500px] rounded-full bg-emerald-700/20 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], y: [0, -30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
          className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/15 blur-[100px]"
        />

        {/* Grid */}
        <div className="hero-grid absolute inset-0 opacity-20" />

        {/* Dot particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-200/20"
            style={{ left: `${8 + i * 8}%`, top: `${15 + (i % 5) * 15}%` }}
            animate={{ y: [0, -20 - i * 3, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute right-[5%] top-[10%] h-[280px] w-[280px] rounded-full border border-amber-800/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute right-[8%] top-[13%] h-[200px] w-[200px] rounded-full border border-amber-600/8"
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative">
        <div className="section-shell relative grid items-center gap-12 pt-20 pb-16 md:grid-cols-[1.1fr,0.9fr] md:pt-28 md:pb-24">
          {/* ── Left: Copy ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-6"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-300 backdrop-blur">
                <ShieldCheck size={13} />
                Botswana's trusted local jobs platform
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-2">
              <h1 className="text-5xl font-black leading-[1.0] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
                Local help for
                <br />
                <AnimatedWord />
                <br />
                <span className="text-white/90">near you.</span>
              </h1>
            </motion.div>

            <motion.p variants={fadeUp} className="max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
              Post a job, review trusted applicants, and connect with verified local workers — all through a clean, safe workflow.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'}
                  className="inline-flex h-12 items-center gap-2 rounded-2xl bg-brand-500 px-6 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-600 hover:shadow-glow-lg"
                >
                  <BriefcaseBusiness size={16} />
                  Post a Job
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/jobs"
                  className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-6 text-sm font-bold text-white backdrop-blur transition-all hover:bg-white/15"
                >
                  <Search size={16} />
                  Browse Jobs
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 pt-2">
              {[
                { icon: ShieldCheck, label: 'Verified workers', color: 'text-sage-400' },
                { icon: Star, label: 'Rated reviews', color: 'text-neon-amber' },
                { icon: Zap, label: 'Fast matching', color: 'text-brand-400' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/50">
                  <Icon size={15} className={color} />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Floating cards visual ── */}
          <div className="relative hidden h-[420px] md:block">
            {/* Center glow */}
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" />

            {/* Cards */}
            <FloatingJobCard card={floatingCards[0]} delay={0.6} style={{ top: '0%', left: '5%' }} />
            <FloatingJobCard card={floatingCards[1]} delay={0.85} style={{ top: '38%', right: '0%' }} />
            <FloatingJobCard card={floatingCards[2]} delay={1.1} style={{ bottom: '0%', left: '15%' }} />

            {/* Stat pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="absolute right-[8%] top-[15%] rounded-2xl border border-amber-900/50 bg-amber-950/60 px-4 py-3 backdrop-blur"
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50">Active jobs</div>
              <div className="mt-1 text-2xl font-black text-white">240+</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="absolute bottom-[12%] right-[5%] flex items-center gap-2 rounded-2xl border border-sage-400/20 bg-sage-500/10 px-3 py-2 backdrop-blur"
            >
              <BadgeCheck size={14} className="text-sage-400" />
              <span className="text-xs font-bold text-sage-300">Trusted & Verified</span>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex justify-center pb-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-amber-700/30 pt-2"
          >
            <div className="h-1.5 w-1 rounded-full bg-amber-300/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
