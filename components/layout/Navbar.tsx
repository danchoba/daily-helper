'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, MapPin, Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: { name?: string; role: string } | null
}

export function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const dashboardHref = user
    ? user.role === 'ADMIN' ? '/dashboard/admin'
    : user.role === 'WORKER' ? '/dashboard/worker'
    : '/dashboard/customer'
    : null

  const isLanding = pathname === '/'

  const navLinks = isLanding
    ? [
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#services', label: 'Services' },
        { href: '#faq', label: 'FAQ' },
        ...(dashboardHref ? [{ href: dashboardHref, label: 'Dashboard', icon: LayoutDashboard }] : []),
      ]
    : [
        { href: '/jobs', label: 'Browse Jobs' },
        ...(dashboardHref ? [{ href: dashboardHref, label: 'Dashboard', icon: LayoutDashboard }] : []),
      ]

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-earth-100/70 bg-white/92 shadow-[0_1px_24px_rgba(13,12,9,0.06)] backdrop-blur-2xl'
            : 'border-b border-transparent bg-[#faf8f5]/80 backdrop-blur-md',
        )}
      >
        <div className="mx-auto flex h-[66px] w-full max-w-6xl items-center justify-between px-4 md:px-6">

          {/* ── Logo ── */}
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Daily Helper home">
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
              <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_60%)]" />
              <span className="relative text-[11px] font-black tracking-widest text-white">DH</span>
            </motion.div>
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold tracking-tight text-earth-900">Daily Helper</div>
              <div className="text-[9.5px] font-semibold text-earth-400 tracking-wide">Trusted local jobs</div>
            </div>
          </Link>

          {/* ── Desktop centre: trust chip ── */}
          <div className="hidden items-center gap-1 rounded-full border border-earth-100 bg-earth-50/80 px-3 py-1.5 md:flex">
            <MapPin size={10} className="text-brand-500" />
            <span className="text-[10px] font-bold tracking-wider text-earth-600">Botswana-First</span>
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-sage-500 shadow-[0_0_6px_rgba(22,163,74,0.6)]" />
          </div>

          {/* ── Desktop nav links + auth ── */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-earth-500 transition-all duration-200 hover:bg-earth-100 hover:text-earth-900"
              >
                {Icon && <Icon size={14} className="opacity-70" />}
                {label}
              </Link>
            ))}

            <div className="ml-3 flex items-center gap-2 border-l border-earth-100 pl-3">
              {user ? (
                <form action="/api/auth/signout" method="POST">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-xl border border-earth-200 bg-white px-4 py-2 text-sm font-semibold text-earth-700 shadow-sm transition-all hover:bg-earth-50"
                  >
                    Sign Out
                  </motion.button>
                </form>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl px-3.5 py-2 text-sm font-semibold text-earth-600 transition-colors hover:text-earth-900"
                  >
                    Log In
                  </Link>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-2 text-sm font-bold text-white shadow-glow-sm transition-all hover:shadow-glow"
                    >
                      <Zap size={12} aria-hidden="true" />
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* ── Mobile hamburger ── */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="rounded-xl p-2.5 text-earth-700 transition-colors hover:bg-earth-100 md:hidden"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="x"
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={21} />
                </motion.div>
              ) : (
                <motion.div key="menu"
                  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={21} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Mobile dropdown ── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-earth-100/80 bg-white/98 backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-0.5 px-4 pb-5 pt-3">
                {navLinks.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ x: -14, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.045 + 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={href}
                      className="flex rounded-xl px-4 py-3 text-[15px] font-semibold text-earth-800 transition-colors hover:bg-earth-50"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ x: -14, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.045 + 0.06 }}
                  className="mt-3 border-t border-earth-100 pt-3"
                >
                  {user ? (
                    <form action="/api/auth/signout" method="POST">
                      <button className="btn-outline w-full">Sign Out</button>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-2.5">
                      <Link href="/login" className="btn-ghost w-full">Log In</Link>
                      <Link href="/signup" className="btn-primary w-full">
                        <Zap size={14} aria-hidden="true" />
                        Get Started Free
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
