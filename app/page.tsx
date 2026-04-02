import Link from 'next/link'
import { ClipboardList, ShieldCheck, Clock, Phone, Users, CheckSquare } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/marketing/HeroSection'
import { FAQ } from '@/components/marketing/FAQ'

export default async function HomePage() {
  const session = await getServerSession()

  return (
    <div className="min-h-screen bg-[#faf8f5] text-earth-900">
      <Navbar user={session} />

      {/* ── HERO ── */}
      <HeroSection session={session} />

      {/* ── FEATURE STRIP ── */}
      <section className="border-y border-earth-100 bg-white py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 md:grid-cols-3 md:px-6">
          {[
            {
              icon: ClipboardList,
              title: 'Post Jobs Easily',
              desc: 'Describe your job & set your budget',
              iconBg: 'bg-amber-100 text-amber-700',
            },
            {
              icon: ShieldCheck,
              title: 'Trusted Local Workers',
              desc: 'Browse profiles & select the best worker',
              iconBg: 'bg-sage-100 text-sage-700',
            },
            {
              icon: Clock,
              title: 'Quick & Reliable',
              desc: 'Relax while the job gets completed',
              iconBg: 'bg-orange-100 text-orange-700',
            },
          ].map(({ icon: Icon, title, desc, iconBg }) => (
            <div key={title} className="flex flex-col items-center gap-4 text-center">
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon size={28} />
              </div>
              <div>
                <h3 className="text-base font-bold text-earth-900">{title}</h3>
                <p className="mt-1 text-sm text-earth-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="section-shell">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-black tracking-tight text-earth-950 md:text-4xl">
            How It Works
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: 1,
              icon: Phone,
              title: 'Post Your Task',
              desc: 'Describe your job & set your budget',
              cardBg: 'bg-amber-50 border-amber-100',
              iconBg: 'bg-amber-100 text-amber-700',
            },
            {
              step: 2,
              icon: Users,
              title: 'Choose Your Helper',
              desc: 'Browse profiles & select the best worker',
              cardBg: 'bg-sage-50 border-sage-100',
              iconBg: 'bg-sage-100 text-sage-700',
            },
            {
              step: 3,
              icon: CheckSquare,
              title: 'Get It Done',
              desc: 'Relax while the job gets completed',
              cardBg: 'bg-green-50 border-green-100',
              iconBg: 'bg-green-100 text-green-700',
            },
          ].map(({ step, icon: Icon, title, desc, cardBg, iconBg }) => (
            <div
              key={step}
              className={`flex flex-col gap-5 rounded-3xl border p-7 ${cardBg}`}
            >
              {/* Numbered badge */}
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
                {step}
              </div>

              {/* Icon illustration area */}
              <div className={`flex h-20 w-20 items-center justify-center self-center rounded-2xl ${iconBg}`}>
                <Icon size={36} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-earth-950">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-earth-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-earth-100 bg-white">
        <div className="section-shell">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 text-center text-3xl font-black tracking-tight text-earth-950 underline decoration-brand-300 underline-offset-[10px] md:text-4xl">
              FAQs
            </h2>
            <FAQ />
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative overflow-hidden bg-brand-600 py-20 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-700/70 blur-[80px]" />
          <div className="absolute -right-10 top-0 h-80 w-80 rounded-full bg-amber-400/20 blur-[100px]" />
          {/* Wave blob */}
          <svg
            className="absolute bottom-0 left-0 w-full opacity-20"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 text-center md:px-6">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-base text-white/75">
            Find help or start earning today!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={session ? '/dashboard/customer/jobs/new' : '/signup'}
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white bg-white px-7 text-sm font-bold text-brand-700 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
            >
              Post a Job
            </Link>
            <Link
              href={session ? '/dashboard/worker' : '/signup?role=worker'}
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white/50 px-7 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              Sign Up as a Worker
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
