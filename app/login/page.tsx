'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Zap } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

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

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#05061a]">
      {/* BG orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-600/25 blur-[100px]" />
        <div className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-accent-600/20 blur-[80px]" />
        <div className="hero-grid absolute inset-0 opacity-15" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-center md:px-6 md:py-0">
        {/* Left — branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden flex-col justify-center py-20 md:flex md:flex-1"
        >
          <Link href="/" className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-black tracking-widest text-white">
              DH
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">Daily Helper</div>
              <div className="text-xs text-white/40">Trusted local jobs</div>
            </div>
          </Link>

          <div className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-400">Welcome back</div>
          <h1 className="mb-4 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Access your<br />
            <span className="bg-gradient-to-r from-neon-teal to-neon-blue bg-clip-text text-transparent">
              workspace.
            </span>
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-white/50">
            Customers manage jobs and applicants. Workers track applications and build their trusted profile.
          </p>

          <div className="mt-10 space-y-3">
            {[
              { icon: ShieldCheck, text: 'Secure JWT authentication' },
              { icon: Zap, text: 'Fast dashboard access' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-white/40"
              >
                <Icon size={16} className="text-brand-400" />
                {text}
              </motion.div>
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
                Sign in
              </motion.h2>
              <motion.p custom={1} variants={fadeUp} initial="hidden" animate="visible" className="mb-8 text-sm text-white/50">
                Continue to your Daily Helper account.
              </motion.p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="mb-1.5 block text-sm font-semibold text-white/70" htmlFor="login-email">
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </motion.div>

                <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
                  <label className="mb-1.5 block text-sm font-semibold text-white/70" htmlFor="login-password">
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
                      className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/25 focus:border-brand-400/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700 hover:shadow-glow-lg disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    {loading ? 'Signing in…' : 'Sign in'}
                  </motion.button>
                </motion.div>
              </form>

              <motion.p custom={5} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-center text-sm text-white/40">
                No account?{' '}
                <Link href="/signup" className="font-bold text-brand-400 hover:text-brand-300">
                  Create one
                </Link>
              </motion.p>

              <motion.div
                custom={6}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-6 rounded-2xl border border-white/8 bg-white/5 p-4"
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Demo accounts</p>
                <div className="space-y-1 text-xs text-white/40">
                  <div>Admin: admin@dailyhelper.bw / admin123</div>
                  <div>Customer: thabo@example.com / password123</div>
                  <div>Worker: kgosi@example.com / password123</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
