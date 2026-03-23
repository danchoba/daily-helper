'use client'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, BriefcaseBusiness, Loader2, UserCheck } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

function SignupForm() {
  const router = useRouter()
  const toast = useToast()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'worker' ? 'WORKER' : 'CUSTOMER'

  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', role: defaultRole })
  const [loading, setLoading] = useState(false)

  const setField = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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

  const inputClass = 'w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20'
  const labelClass = 'mb-1.5 block text-sm font-semibold text-white/70'

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#05061a]">
      {/* BG orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-600/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand-600/20 blur-[80px]" />
        <div className="hero-grid absolute inset-0 opacity-15" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-4 py-8 md:flex-row md:items-center md:gap-12 md:px-6 md:py-0">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden flex-col justify-center py-20 md:flex md:flex-1"
        >
          <Link href="/" className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-black tracking-widest text-white">DH</div>
            <div>
              <div className="text-sm font-extrabold text-white">Daily Helper</div>
              <div className="text-xs text-white/40">Trusted local jobs</div>
            </div>
          </Link>

          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-400">Join Daily Helper</div>
          <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            The right role<br />
            <span className="bg-gradient-to-r from-accent-400 to-brand-400 bg-clip-text text-transparent">
              for your needs.
            </span>
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-white/50">
            Customers post jobs for free. Workers build trusted profiles and apply nearby.
          </p>

          {/* Role cards */}
          <div className="mt-10 space-y-3">
            {[
              { role: 'CUSTOMER', icon: BriefcaseBusiness, label: 'Customer', desc: 'Post jobs, review applicants, hire local workers', color: 'border-brand-500/30 bg-brand-500/10' },
              { role: 'WORKER', icon: UserCheck, label: 'Worker', desc: 'Build your profile, apply to nearby jobs', color: 'border-sage-500/30 bg-sage-500/10' },
            ].map(({ role, icon: Icon, label, desc, color }) => (
              <motion.button
                key={role}
                type="button"
                onClick={() => setForm(f => ({ ...f, role }))}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200',
                  color,
                  form.role === role ? 'ring-2 ring-brand-400/50' : 'opacity-60',
                )}
              >
                <Icon size={20} className="shrink-0 text-white/70" />
                <div>
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-xs text-white/50">{desc}</div>
                </div>
                {form.role === role && <div className="ml-auto h-2 w-2 rounded-full bg-brand-400" />}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <div className="flex flex-1 items-center justify-center py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-6 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-black text-white">DH</div>
                <span className="text-sm font-bold text-white">Daily Helper</span>
              </Link>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
              <motion.h2 custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-1 text-2xl font-black text-white">
                Create account
              </motion.h2>
              <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mb-8 text-sm text-white/50">
                Join Botswana's trusted local jobs platform.
              </motion.p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role selector */}
                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                  <label className={labelClass} htmlFor="signup-role">Account type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'CUSTOMER', label: 'Customer', icon: BriefcaseBusiness },
                      { value: 'WORKER', label: 'Worker', icon: UserCheck },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: value }))}
                        className={cn(
                          'flex items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-bold transition-all',
                          form.role === value
                            ? 'border-brand-400/60 bg-brand-500/20 text-white'
                            : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70',
                        )}
                      >
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                  <label className={labelClass} htmlFor="signup-name">Full name</label>
                  <input id="signup-name" className={inputClass} value={form.name} onChange={setField('name')} required placeholder="Thabo Molefe" />
                </motion.div>

                <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                  <label className={labelClass} htmlFor="signup-email">Email address</label>
                  <input id="signup-email" type="email" className={inputClass} value={form.email} onChange={setField('email')} required placeholder="you@example.com" />
                </motion.div>

                <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
                  <label className={labelClass} htmlFor="signup-phone">
                    Phone <span className="font-normal text-white/30">(optional)</span>
                  </label>
                  <input id="signup-phone" className={inputClass} value={form.phoneNumber} onChange={setField('phoneNumber')} placeholder="+267 71 234 567" />
                </motion.div>

                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
                  <label className={labelClass} htmlFor="signup-password">Password</label>
                  <input id="signup-password" type="password" className={inputClass} value={form.password} onChange={setField('password')} required placeholder="At least 8 characters" minLength={8} />
                </motion.div>

                <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700 hover:shadow-glow-lg disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {loading ? 'Creating account…' : 'Create account'}
                  </motion.button>
                </motion.div>
              </form>

              <motion.p custom={8} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center text-sm text-white/40">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-brand-400 hover:text-brand-300">Sign in</Link>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05061a]" />}>
      <SignupForm />
    </Suspense>
  )
}
