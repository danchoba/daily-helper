'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { BriefcaseBusiness, LayoutDashboard, Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  user?: { name: string; role: string } | null
}

export function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const dashboardHref = user
    ? user.role === 'ADMIN' ? '/dashboard/admin'
    : user.role === 'WORKER' ? '/dashboard/worker'
    : '/dashboard/customer'
    : null

  const isHeroPage = pathname === '/'
  const transparent = isHeroPage && !scrolled && !menuOpen
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        transparent
          ? 'bg-transparent'
          : 'border-b border-earth-200/60 bg-white/90 shadow-sm backdrop-blur-xl',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Daily Helper home">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black tracking-widest transition-colors',
              transparent ? 'bg-white text-brand-600' : 'bg-brand-600 text-white',
            )}
          >
            DH
          </motion.div>
          <div className="leading-tight">
            <div className={cn('text-sm font-extrabold tracking-tight transition-colors', transparent ? 'text-white' : 'text-earth-900')}>
              Daily Helper
            </div>
            <div className={cn('text-[10px] font-medium transition-colors', transparent ? 'text-white/60' : 'text-earth-400')}>
              Trusted local jobs
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {[
            { href: '/jobs', label: 'Browse Jobs', icon: BriefcaseBusiness },
            ...(dashboardHref ? [{ href: dashboardHref, label: 'Dashboard', icon: LayoutDashboard }] : []),
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200',
                transparent
                  ? isActive(href)
                    ? 'bg-white/15 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  : isActive(href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-earth-600 hover:bg-earth-100 hover:text-earth-900',
              )}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
              {isActive(href) && !transparent && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-brand-50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2">
            {user ? (
              <form action="/api/auth/signout" method="POST">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'rounded-xl border px-4 py-2 text-sm font-semibold transition-colors',
                    transparent
                      ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
                      : 'border-earth-200 bg-white text-earth-700 hover:bg-earth-50',
                  )}
                >
                  Sign Out
                </motion.button>
              </form>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
                    transparent ? 'text-white/80 hover:text-white' : 'text-earth-600 hover:text-earth-900',
                  )}
                >
                  Log In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/signup"
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold shadow-sm transition-all',
                      transparent
                        ? 'bg-white text-brand-700 hover:bg-blue-50'
                        : 'bg-brand-600 text-white shadow-glow-sm hover:bg-brand-700',
                    )}
                  >
                    <Zap size={13} aria-hidden="true" />
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className={cn(
            'rounded-xl p-2 transition-colors md:hidden',
            transparent ? 'text-white hover:bg-white/10' : 'text-earth-700 hover:bg-earth-100',
          )}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-earth-200/60 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {[
                { href: '/jobs', label: 'Browse Jobs' },
                ...(dashboardHref ? [{ href: dashboardHref, label: 'Dashboard' }] : []),
              ].map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      'flex rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                      isActive(href) ? 'bg-brand-50 text-brand-700' : 'text-earth-800 hover:bg-earth-50',
                    )}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-1 border-t border-earth-100 pt-2"
              >
                {user ? (
                  <form action="/api/auth/signout" method="POST">
                    <button className="btn-outline w-full">Sign Out</button>
                  </form>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" className="btn-ghost w-full">Log In</Link>
                    <Link href="/signup" className="btn-primary w-full">
                      <Zap size={14} />
                      Get Started
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
