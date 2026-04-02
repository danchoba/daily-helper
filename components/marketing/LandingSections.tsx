'use client'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import {
  Sparkles, Leaf, Package, Paintbrush, Droplets, ShoppingBag,
  Wrench, Shield, BadgeCheck, Star, Users, Phone, CheckSquare,
  ArrowRight, Zap, Clock, TrendingUp, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import type { PlatformStats } from '@/app/page'

interface LandingSectionsProps {
  session: { role: string } | null
  stats: PlatformStats
}

// ── Animation presets ──────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

// ── Data ───────────────────────────────────────────────────────────────────────
const services = [
  { label: 'Cleaning', icon: Sparkles, from: 'from-amber-50', to: 'to-amber-100/70', border: 'border-amber-200/50', accent: 'text-amber-600', iconBg: 'bg-amber-100', count: '340+ helpers' },
  { label: 'Gardening', icon: Leaf, from: 'from-sage-50', to: 'to-sage-100/70', border: 'border-sage-200/50', accent: 'text-sage-600', iconBg: 'bg-sage-100', count: '180+ helpers' },
  { label: 'Moving', icon: Package, from: 'from-sky-50', to: 'to-sky-100/70', border: 'border-sky-200/50', accent: 'text-sky-600', iconBg: 'bg-sky-100', count: '90+ helpers' },
  { label: 'Painting', icon: Paintbrush, from: 'from-rose-50', to: 'to-rose-100/70', border: 'border-rose-200/50', accent: 'text-rose-500', iconBg: 'bg-rose-100', count: '75+ helpers' },
  { label: 'Plumbing', icon: Droplets, from: 'from-blue-50', to: 'to-blue-100/70', border: 'border-blue-200/50', accent: 'text-blue-600', iconBg: 'bg-blue-100', count: '60+ helpers' },
  { label: 'Errands', icon: ShoppingBag, from: 'from-violet-50', to: 'to-violet-100/70', border: 'border-violet-200/50', accent: 'text-violet-600', iconBg: 'bg-violet-100', count: '200+ helpers' },
  { label: 'Handyman', icon: Wrench, from: 'from-orange-50', to: 'to-orange-100/70', border: 'border-orange-200/50', accent: 'text-orange-600', iconBg: 'bg-orange-100', count: '150+ helpers' },
  { label: 'Security', icon: Shield, from: 'from-earth-50', to: 'to-earth-100/70', border: 'border-earth-200/50', accent: 'text-earth-600', iconBg: 'bg-earth-100', count: '40+ helpers' },
]

const testimonials = [
  {
    name: 'Kefilwe M.',
    location: 'Gaborone West',
    role: 'Customer',
    rating: 5,
    avatar: 'K',
    avatarColor: 'from-brand-400 to-brand-600',
    text: 'I posted a cleaning job at 9am and had someone at my door by 11am. The helper was thorough and professional — a fraction of what agencies charge.',
    tag: 'House Cleaning',
  },
  {
    name: 'Thabo S.',
    location: 'Broadhurst',
    role: 'Worker',
    rating: 5,
    avatar: 'T',
    avatarColor: 'from-sage-500 to-sage-700',
    text: 'Daily Helper completely changed how I find clients. I get 3–5 new jobs a week without any middleman fees. It\'s given me real financial independence.',
    tag: 'Plumber & Handyman',
  },
  {
    name: 'Mpho D.',
    location: 'Tlokweng',
    role: 'Customer',
    rating: 5,
    avatar: 'M',
    avatarColor: 'from-amber-400 to-orange-500',
    text: 'Needed my garden sorted before a family event. Within 30 minutes I had two verified workers ready. Everything went smoothly from start to finish.',
    tag: 'Garden & Landscaping',
  },
]

const faqs = [
  {
    q: 'How do I post a job?',
    a: 'Sign up as a customer, then click "Post a Job" from your dashboard. Fill in the job details, location, budget, and timing. Your listing goes live immediately for local workers to see and apply.',
  },
  {
    q: 'Is there a verification process?',
    a: 'Yes. Workers submit their ID and pay a one-time BWP 50 fee to receive a Trusted badge. An admin reviews each submission before approving. Customers can filter for trusted workers only.',
  },
  {
    q: 'How are workers paid?',
    a: 'Payment is arranged directly between customers and workers after contact is unlocked. Daily Helper facilitates the connection via a small BWP 25 contact fee paid by the customer.',
  },
  {
    q: 'Is Daily Helper free to join?',
    a: 'Signing up is completely free for both customers and workers. Customers pay a BWP 25 connection fee when they choose to unlock a worker\'s contact details. Workers pay a one-time BWP 50 to get their Trusted badge.',
  },
]

// ── Components ─────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50 px-3.5 py-1.5">
      <span className="text-[10.5px] font-bold uppercase tracking-widest text-brand-600">{children}</span>
    </div>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          variants={fadeUp}
          className="overflow-hidden rounded-2xl border border-earth-100 bg-white shadow-card"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-[15px] font-semibold text-earth-900 transition-colors hover:bg-earth-50"
            aria-expanded={open === i}
          >
            <span>{faq.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-earth-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-earth-100 px-6 pb-5 pt-3.5 text-[14px] leading-relaxed text-earth-500"
            >
              {faq.a}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export function LandingSections({ session, stats }: LandingSectionsProps) {
  const verifiedDisplay = stats.verifiedWorkers > 0 ? `${stats.verifiedWorkers.toLocaleString()}+` : '0'
  const completedDisplay = stats.completedJobs > 0 ? `${stats.completedJobs.toLocaleString()}+` : '0'
  const avgDisplay = stats.avgRating ? `${stats.avgRating.toFixed(1)}★` : '—'

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="border-y border-earth-100 bg-white py-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-6"
        >
          {[
            { value: verifiedDisplay, label: 'Verified Helpers', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
            { value: completedDisplay, label: 'Jobs Completed', icon: CheckSquare, color: 'text-sage-600', bg: 'bg-sage-50' },
            { value: avgDisplay, label: 'Average Rating', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
            { value: 'Free', label: 'To Sign Up', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map(({ value, label, icon: Icon, color, bg }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="flex items-center gap-4"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight text-earth-950">{value}</div>
                <div className="text-[12px] font-semibold text-earth-400">{label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="section-shell">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center gap-14"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 text-center">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight text-earth-950 md:text-5xl">
              Simple as 1, 2, 3.
            </h2>
            <p className="max-w-md text-[16px] leading-relaxed text-earth-500">
              From posting to done, the whole thing takes minutes — not days.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="relative w-full">
            {/* Connecting line (desktop only) */}
            <div className="absolute left-0 right-0 top-[52px] mx-auto hidden h-px max-w-3xl bg-gradient-to-r from-transparent via-earth-200 to-transparent md:block" />

            <motion.div
              variants={stagger}
              className="grid gap-6 md:grid-cols-3"
            >
              {[
                {
                  step: '01',
                  icon: Phone,
                  title: 'Post Your Task',
                  desc: 'Describe the job, set your budget, and choose when you need it done. Takes under 2 minutes.',
                  accent: 'bg-brand-600',
                  cardBg: 'bg-white',
                  iconBg: 'bg-amber-50',
                  iconColor: 'text-amber-600',
                },
                {
                  step: '02',
                  icon: Users,
                  title: 'Choose Your Helper',
                  desc: 'Review profiles, ratings, and experience. Unlock contact details for the helper you want.',
                  accent: 'bg-sage-600',
                  cardBg: 'bg-white',
                  iconBg: 'bg-sage-50',
                  iconColor: 'text-sage-600',
                },
                {
                  step: '03',
                  icon: CheckSquare,
                  title: 'Get It Done',
                  desc: 'Your helper arrives and gets the job done. Leave a review to help the community.',
                  accent: 'bg-orange-500',
                  cardBg: 'bg-white',
                  iconBg: 'bg-orange-50',
                  iconColor: 'text-orange-600',
                },
              ].map(({ step, icon: Icon, title, desc, accent, cardBg, iconBg, iconColor }) => (
                <motion.div
                  key={step}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.25 } }}
                  className={`relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-earth-100 ${cardBg} p-8 shadow-card`}
                >
                  {/* Step number — decorative large */}
                  <div className="absolute -right-2 -top-4 text-[88px] font-black leading-none text-earth-50 select-none">
                    {step}
                  </div>
                  {/* Step pill */}
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${accent} text-xs font-black text-white shadow-sm`}>
                    {parseInt(step)}
                  </div>
                  {/* Icon */}
                  <div className={`relative flex h-16 w-16 items-center justify-center self-start rounded-2xl ${iconBg}`}>
                    <Icon size={28} className={iconColor} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-earth-950">{title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-earth-500">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SERVICES GRID
      ══════════════════════════════════════════════════════════ */}
      <section id="services" className="border-t border-earth-100 bg-white py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mx-auto max-w-6xl px-4 md:px-6"
        >
          <motion.div variants={fadeUp} className="mb-12 flex flex-col items-center gap-3 text-center">
            <SectionLabel>Services</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight text-earth-950 md:text-5xl">
              Whatever the job, we've got you.
            </h2>
            <p className="max-w-md text-[16px] text-earth-500">
              Browse helpers by category and find exactly who you need.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
          >
            {services.map(({ label, icon: Icon, from, to, border, accent, iconBg, count }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.22 } }}
                className={`group flex cursor-pointer flex-col items-center gap-3.5 rounded-3xl border ${border} bg-gradient-to-br ${from} ${to} p-6 text-center transition-shadow hover:shadow-card`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} transition-transform group-hover:scale-110`}>
                  <Icon size={24} className={accent} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-earth-900">{label}</div>
                  <div className={`mt-0.5 text-[11px] font-semibold ${accent} opacity-80`}>{count}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-2xl border border-earth-200 bg-white px-6 py-3 text-[14px] font-bold text-earth-700 shadow-sm transition-all hover:border-earth-300 hover:bg-earth-50"
            >
              View all services
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CUSTOMER vs WORKER — TWO COLUMNS
      ══════════════════════════════════════════════════════════ */}
      <section className="section-shell">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="flex flex-col gap-14"
        >
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 text-center">
            <SectionLabel>Who Is This For?</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight text-earth-950 md:text-5xl">
              Built for two sides<br className="hidden md:block" /> of every job.
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* For Customers */}
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50/60 p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-200/30 blur-3xl" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 shadow-sm border border-amber-100">
                  <div className="h-2 w-2 rounded-full bg-brand-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-brand-700">For Customers</span>
                </div>
                <h3 className="mb-3 text-3xl font-black text-earth-950">Get help in minutes.</h3>
                <p className="mb-8 text-[15px] leading-relaxed text-earth-500">
                  Post any task and let qualified local workers come to you. No endless searching, no haggling.
                </p>
                <ul className="mb-8 space-y-3.5">
                  {[
                    'Post a job in under 2 minutes',
                    'Browse rated, ID-verified workers',
                    'Unlock contact for only BWP 25',
                    'Leave a review after the job',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100">
                        <CheckSquare size={11} className="text-brand-600" />
                      </div>
                      <span className="text-[14px] font-medium text-earth-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-3 text-[14px] font-bold text-white shadow-glow-sm hover:shadow-glow transition-all"
                  >
                    <Sparkles size={15} />
                    Post Your First Job
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* For Workers */}
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl border border-sage-200/60 bg-gradient-to-br from-sage-50 to-earth-50/60 p-8"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sage-200/30 blur-3xl" />
              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 shadow-sm border border-sage-100">
                  <div className="h-2 w-2 rounded-full bg-sage-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-sage-700">For Workers</span>
                </div>
                <h3 className="mb-3 text-3xl font-black text-earth-950">Earn on your terms.</h3>
                <p className="mb-8 text-[15px] leading-relaxed text-earth-500">
                  Build your client base, grow your reputation, and get paid doing what you're already good at.
                </p>
                <ul className="mb-8 space-y-3.5">
                  {[
                    'Free to sign up and browse jobs',
                    'Get a Trusted badge for only BWP 50',
                    'Apply to jobs that match your skills',
                    'Build reviews and grow your profile',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-100">
                        <CheckSquare size={11} className="text-sage-600" />
                      </div>
                      <span className="text-[14px] font-medium text-earth-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={session?.role === 'WORKER' ? '/dashboard/worker' : '/signup?role=worker'}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sage-600 px-6 py-3 text-[14px] font-bold text-white shadow-glow-teal transition-all hover:bg-sage-700"
                  >
                    <TrendingUp size={15} />
                    Start Earning Today
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TRUST & VERIFICATION
      ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-earth-100 bg-earth-950 py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mx-auto max-w-6xl px-4 md:px-6"
        >
          <motion.div variants={fadeUp} className="mb-14 flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5">
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-earth-400">Trust & Safety</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              Safety built into everything.
            </h2>
            <p className="max-w-md text-[16px] text-earth-400">
              We've built the trust layer so you don't have to guess.
            </p>
          </motion.div>

          <motion.div variants={stagger} className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: BadgeCheck,
                title: 'ID Verification',
                desc: 'Every worker who wants a Trusted badge submits a valid national ID. Our team reviews each application personally.',
                accent: 'text-sage-400',
                iconBg: 'bg-sage-900/60',
                border: 'border-sage-900/40',
              },
              {
                icon: Star,
                title: 'Community Ratings',
                desc: 'Every completed job leaves a paper trail. Customers rate workers publicly, creating genuine accountability.',
                accent: 'text-amber-400',
                iconBg: 'bg-amber-900/60',
                border: 'border-amber-900/40',
              },
              {
                icon: Clock,
                title: 'Fast & Responsive',
                desc: 'Workers get notified instantly when a job is posted near them. Most jobs receive applicants within the hour.',
                accent: 'text-brand-400',
                iconBg: 'bg-brand-900/60',
                border: 'border-brand-900/40',
              },
            ].map(({ icon: Icon, title, desc, accent, iconBg, border }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
                className={`flex flex-col gap-5 rounded-3xl border ${border} bg-white/4 p-8`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
                  <Icon size={26} className={accent} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-white">{title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-earth-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-[#faf8f5] py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="mx-auto max-w-6xl px-4 md:px-6"
        >
          <motion.div variants={fadeUp} className="mb-12 flex flex-col items-center gap-3 text-center">
            <SectionLabel>Stories</SectionLabel>
            <h2 className="text-4xl font-black tracking-tight text-earth-950 md:text-5xl">
              Real people. Real results.
            </h2>
          </motion.div>

          <motion.div variants={stagger} className="grid gap-5 md:grid-cols-3">
            {testimonials.map(({ name, location, role, rating, avatar, avatarColor, text, tag }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
                className="flex flex-col gap-5 rounded-3xl border border-earth-100 bg-white p-7 shadow-card"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="flex-1 text-[14px] leading-[1.75] text-earth-600">"{text}"</p>

                {/* Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${avatarColor} text-[13px] font-black text-white`}>
                      {avatar}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-earth-900">{name}</p>
                      <p className="text-[11px] text-earth-400">{location} · {role}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-earth-50 px-2.5 py-1 text-[10px] font-semibold text-earth-500">{tag}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════ */}
      <section id="faq" className="border-t border-earth-100 bg-white py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex flex-col gap-8"
          >
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="text-4xl font-black tracking-tight text-earth-950 md:text-5xl">
                Common questions.
              </h2>
            </motion.div>
            <motion.div variants={stagger}>
              <FAQSection />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 md:py-32">
        {/* Warm amber gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800" />
        {/* Texture overlays */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-amber-400/20 blur-[120px]" />
          <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-orange-900/40 blur-[100px]" />
          <div className="hero-grid absolute inset-0 opacity-10" />
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={stagger}
          className="relative mx-auto max-w-3xl px-4 text-center md:px-6"
        >
          <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.8)]" />
            <span className="text-[10.5px] font-bold uppercase tracking-widest text-white/80">Available Now</span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-4xl font-black tracking-tight text-white md:text-[56px] md:leading-[1.04]"
          >
            Ready to get something done?
          </motion.h2>

          <motion.p variants={fadeUp} className="mt-5 text-[17px] leading-relaxed text-white/70">
            Join thousands of people across Botswana who use Daily Helper to get everyday jobs
            done faster, smarter, and for a fair price.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'}
                className="inline-flex h-14 items-center gap-2.5 rounded-2xl bg-white px-8 text-[15px] font-bold text-brand-700 shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all hover:bg-brand-50"
              >
                <Sparkles size={16} className="text-brand-600" />
                Post a Job — It's Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={session?.role === 'WORKER' ? '/dashboard/worker' : '/signup?role=worker'}
                className="inline-flex h-14 items-center gap-2.5 rounded-2xl border-2 border-white/30 bg-white/10 px-8 text-[15px] font-bold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
              >
                Start Earning
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-8 text-[13px] text-white/50">
            No contracts. No hidden fees. Cancel anytime.
          </motion.p>
        </motion.div>
      </section>
    </>
  )
}
