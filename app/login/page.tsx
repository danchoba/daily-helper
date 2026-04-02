'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Loader2, BadgeCheck, Star, Users } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function LoginPage() {
  const router = useRouter()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Sign in failed. Check your credentials.')
        return
      }
      toast.success('Welcome back!')
      if (data.role === 'ADMIN') router.push('/dashboard/admin')
      else if (data.role === 'WORKER') router.push('/dashboard/worker')
      else router.push('/dashboard/customer')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-earth-950">
      {/* ── Warm atmospheric BG ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-brand-700/30 blur-[140px]" />
        <div className="absolute -bottom-32 right-0 h-[500px] w-[500px] rounded-full bg-orange-900/25 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-800/15 blur-[100px]" />
        <div className="hero-grid absolute inset-0 opacity-[0.07]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-center md:px-6 md:py-0">

        {/* ── Left: Brand panel ── */}
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

          <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-brand-400">Welcome back</div>
          <h1 className="mb-5 text-5xl font-black leading-[1.06] tracking-tight text-white">
            Back to your<br />
            <span className="bg-gradient-to-r from-brand-400 to-amber-300 bg-clip-text text-transparent">
              workspace.
            </span>
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-earth-400">
            Manage jobs, review workers, track applications — all from one place.
          </p>

          <div className="mt-12 space-y-3.5">
            {[
              { icon: BadgeCheck, text: 'ID-verified worker profiles' },
              { icon: Star, text: 'Community ratings & reviews' },
              { icon: Users, text: 'Local jobs across Botswana' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 text-[13px] text-earth-400"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-900/50 border border-brand-800/60">
                  <Icon size={13} className="text-brand-400" />
                </div>
                {text}
              </motion.div>
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
              {/* Accent stripe */}
              <div className="h-0.5 w-full bg-gradient-to-r from-brand-600 via-amber-400 to-brand-600 opacity-70" />

              <div className="p-8">
                <motion.h2 {...fadeUp(0)} className="mb-1 text-[22px] font-black text-white">
                  Sign in
                </motion.h2>
                <motion.p {...fadeUp(0.06)} className="mb-8 text-sm text-earth-400">
                  Continue to your Daily Helper account.
                </motion.p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div {...fadeUp(0.12)}>
                    <label className="mb-1.5 block text-sm font-semibold text-earth-300" htmlFor="login-email">
                      Email address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-earth-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                  </motion.div>

                  <motion.div {...fadeUp(0.18)}>
                    <label className="mb-1.5 block text-sm font-semibold text-earth-300" htmlFor="login-password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-earth-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-earth-500 transition-colors hover:text-earth-300"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div {...fadeUp(0.24)}>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 py-3.5 text-sm font-bold text-white shadow-glow-sm transition-all hover:shadow-glow disabled:opacity-60"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                      {loading ? 'Signing in…' : 'Sign in'}
                    </motion.button>
                  </motion.div>
                </form>

                <motion.p {...fadeUp(0.3)} className="mt-6 text-center text-sm text-earth-500">
                  No account?{' '}
                  <Link href="/signup" className="font-bold text-brand-400 transition-colors hover:text-brand-300">
                    Create one free
                  </Link>
                </motion.p>

                <motion.div
                  {...fadeUp(0.36)}
                  className="mt-6 rounded-2xl border border-white/5 bg-white/3 p-4"
                >
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-earth-600">Demo accounts</p>
                  <div className="space-y-1 text-[12px] text-earth-500">
                    <div>Admin: admin@dailyhelper.bw / admin123</div>
                    <div>Customer: thabo@example.com / password123</div>
                    <div>Worker: kgosi@example.com / password123</div>
                  </div>
                </motion.div>
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
