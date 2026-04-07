'use client'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, Loader2, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

function SignupForm() {
  const router = useRouter()
  const toast = useToast()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'worker' ? 'WORKER' : 'CUSTOMER'
  const oauthError = searchParams.get('error') === 'no_account'

  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', role: defaultRole })
  const [loading, setLoading] = useState(false)

  const setField = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm(current => ({ ...current, [key]: event.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Signup failed. Please try again.')
        return
      }
      toast.success('Account created! Welcome to Daily Helper.')
      if (data.role === 'WORKER') router.push('/dashboard/worker')
      else router.push('/dashboard/customer')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-earth-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
  const labelClass = 'mb-1.5 block text-sm font-semibold text-earth-300'

  const roleConfig = {
    CUSTOMER: {
      label: 'Post jobs',
      desc: 'Hire trusted local workers',
      icon: BriefcaseBusiness,
      active: 'border-brand-500/60 bg-brand-500/15 text-white',
      inactive: 'border-white/10 text-earth-500 hover:border-white/20 hover:text-earth-300',
    },
    WORKER: {
      label: 'Find work',
      desc: 'Earn doing what you do',
      icon: UserCheck,
      active: 'border-sage-500/60 bg-sage-500/15 text-white',
      inactive: 'border-white/10 text-earth-500 hover:border-white/20 hover:text-earth-300',
    },
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-earth-950">
      {/* ── Warm atmospheric BG ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full bg-brand-700/25 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-orange-900/20 blur-[120px]" />
        <div className="absolute right-1/3 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-amber-800/12 blur-[100px]" />
        <div className="hero-grid absolute inset-0 opacity-[0.07]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 py-8 md:flex-row md:items-center md:gap-12 md:px-6 md:py-0">

        {/* ── Left: Value prop panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden flex-col justify-center py-20 md:flex md:flex-1"
        >
          <Link href="/" className="mb-14 flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
              <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
              <span className="relative text-[11px] font-black tracking-widest text-white">DH</span>
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold tracking-tight text-white">Daily Helper</div>
              <div className="text-[10px] font-semibold text-earth-500 tracking-wide">Trusted local jobs</div>
            </div>
          </Link>

          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-brand-400">Join Daily Helper</div>
          <h1 className="mb-5 text-5xl font-black leading-[1.06] tracking-tight text-white">
            Your role,<br />
            <span className="bg-gradient-to-r from-amber-400 to-brand-400 bg-clip-text text-transparent">
              your choice.
            </span>
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-earth-400">
            Customers post jobs for free. Workers build trusted profiles and discover nearby gigs.
          </p>

          {/* Role value cards */}
          <div className="mt-10 space-y-3">
            {[
              {
                role: 'CUSTOMER',
                icon: BriefcaseBusiness,
                label: 'As a customer',
                desc: 'Post jobs, review applicants, hire local workers',
                color: 'border-brand-800/60 bg-brand-900/30',
                accent: 'text-brand-400',
                selected: form.role === 'CUSTOMER',
              },
              {
                role: 'WORKER',
                icon: UserCheck,
                label: 'As a worker',
                desc: 'Build your profile, earn your Trusted badge, get hired',
                color: 'border-sage-800/60 bg-sage-900/30',
                accent: 'text-sage-400',
                selected: form.role === 'WORKER',
              },
            ].map(({ role, icon: Icon, label, desc, color, accent, selected }) => (
              <motion.button
                key={role}
                type="button"
                onClick={() => setForm(f => ({ ...f, role }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200',
                  color,
                  selected ? 'ring-1 ring-white/15' : 'opacity-55',
                )}
              >
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border', color)}>
                  <Icon size={16} className={accent} />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white">{label}</div>
                  <div className="text-[11px] text-earth-500">{desc}</div>
                </div>
                {selected && (
                  <CheckCircle2 size={16} className={cn('ml-auto shrink-0', accent)} />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Form ── */}
        <div className="flex flex-1 items-center justify-center py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            {/* Mobile logo */}
            <div className="mb-8 md:hidden">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
                  <span className="relative text-[10px] font-black tracking-widest text-white">DH</span>
                </div>
                <span className="text-[14px] font-bold text-white">Daily Helper</span>
              </Link>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/8 bg-earth-900/60 shadow-glass backdrop-blur-2xl">
              <div className="h-0.5 w-full bg-gradient-to-r from-amber-500 via-brand-500 to-sage-500 opacity-70" />

              <div className="p-8">
                <motion.h2 {...fadeUp(0)} className="mb-1 text-[22px] font-black text-white">
                  Create account
                </motion.h2>
                <motion.p {...fadeUp(0.06)} className="mb-7 text-sm text-earth-400">
                  Join Botswana's trusted local jobs platform.
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Role toggle */}
                  <motion.div {...fadeUp(0.1)}>
                    <label className={labelClass}>I want to</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.entries(roleConfig) as [string, typeof roleConfig['CUSTOMER']][]).map(([value, cfg]) => {
                        const Icon = cfg.icon
                        const isActive = form.role === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, role: value }))}
                            className={cn(
                              'flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold transition-all',
                              isActive ? cfg.active : cfg.inactive,
                            )}
                          >
                            <Icon size={14} aria-hidden="true" />
                            {cfg.label}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>

                  <motion.div {...fadeUp(0.14)}>
                    <label className={labelClass} htmlFor="signup-name">Full name</label>
                    <input id="signup-name" className={inputClass} value={form.name} onChange={setField('name')} required placeholder="Thabo Molefe" />
                  </motion.div>

                  <motion.div {...fadeUp(0.18)}>
                    <label className={labelClass} htmlFor="signup-email">Email address</label>
                    <input id="signup-email" type="email" className={inputClass} value={form.email} onChange={setField('email')} required placeholder="you@example.com" />
                  </motion.div>

                  <motion.div {...fadeUp(0.22)}>
                    <label className={labelClass} htmlFor="signup-phone">
                      Phone <span className="font-normal text-earth-600">(optional)</span>
                    </label>
                    <input id="signup-phone" className={inputClass} value={form.phoneNumber} onChange={setField('phoneNumber')} placeholder="+267 71 234 567" />
                  </motion.div>

                  <motion.div {...fadeUp(0.26)}>
                    <label className={labelClass} htmlFor="signup-password">Password</label>
                    <input id="signup-password" type="password" className={inputClass} value={form.password} onChange={setField('password')} required placeholder="At least 8 characters" minLength={8} />
                  </motion.div>

                  <motion.div {...fadeUp(0.3)}>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 py-3.5 text-sm font-bold text-white shadow-glow-sm transition-all hover:shadow-glow disabled:opacity-60"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                      {loading ? 'Creating account…' : 'Create account — it\'s free'}
                    </motion.button>
                  </motion.div>
                </form>

                {oauthError && (
                  <motion.div {...fadeUp(0.32)} className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    <AlertCircle size={14} className="shrink-0" />
                    No account found for that Google address. Pick a role and sign up below.
                  </motion.div>
                )}

                <motion.div {...fadeUp(0.34)}>
                  <div className="relative my-5 flex items-center">
                    <div className="flex-1 border-t border-white/8" />
                    <span className="mx-3 text-[11px] font-semibold uppercase tracking-widest text-earth-600">or</span>
                    <div className="flex-1 border-t border-white/8" />
                  </div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { window.location.href = `/api/auth/google?role=${form.role}` }}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-sm font-bold text-white transition-all hover:border-white/20 hover:bg-white/8"
                  >
                    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
                      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" />
                    </svg>
                    Continue with Google
                  </motion.button>
                </motion.div>

                <motion.p {...fadeUp(0.38)} className="mt-6 text-center text-sm text-earth-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-brand-400 transition-colors hover:text-brand-300">
                    Sign in
                  </Link>
                </motion.p>
              </div>
            </div>

            <motion.p {...fadeUp(0.42)} className="mt-5 text-center text-[12px] text-earth-600">
              <Link href="/" className="transition-colors hover:text-earth-400">← Back to Daily Helper</Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-earth-950" />}>
      <SignupForm />
    </Suspense>
  )
}
