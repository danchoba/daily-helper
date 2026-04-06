'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BriefcaseBusiness,
  ClipboardList,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { cn } from '@/lib/utils'

type Role = 'CUSTOMER' | 'WORKER' | 'ADMIN'

interface DashboardFrameProps {
  user: { id: string; name: string; role: Role }
  children: React.ReactNode
  showOnboarding?: boolean
}

const navConfig: Record<Role, { label: string; href: string; icon: LucideIcon }[]> = {
  CUSTOMER: [
    { label: 'Overview', href: '/dashboard/customer', icon: ClipboardList },
    { label: 'My Jobs', href: '/dashboard/customer/jobs', icon: BriefcaseBusiness },
    { label: 'Reviews', href: '/dashboard/customer/reviews', icon: Star },
  ],
  WORKER: [
    { label: 'Overview', href: '/dashboard/worker', icon: ClipboardList },
    { label: 'Jobs', href: '/dashboard/worker/jobs', icon: BriefcaseBusiness },
    { label: 'Applications', href: '/dashboard/worker/applications', icon: Users },
    { label: 'Profile', href: '/dashboard/worker/profile', icon: UserRound },
    { label: 'Verification', href: '/dashboard/worker/verification', icon: ShieldCheck },
  ],
  ADMIN: [
    { label: 'Overview', href: '/dashboard/admin', icon: ClipboardList },
    { label: 'Jobs', href: '/dashboard/admin/jobs', icon: BriefcaseBusiness },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Verifications', href: '/dashboard/admin/verifications', icon: ShieldCheck },
  ],
}

const roleLabels: Record<Role, string> = { CUSTOMER: 'Customer', WORKER: 'Worker', ADMIN: 'Admin' }

function NavItem({
  item,
  active,
  index,
}: {
  item: { label: string; href: string; icon: LucideIcon }
  active: boolean
  index: number
}) {
  const Icon = item.icon
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.055, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={item.href}
        className={cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150',
          active ? 'text-brand-700 font-semibold' : 'text-earth-600 hover:bg-earth-50 hover:text-earth-900',
        )}
        aria-current={active ? 'page' : undefined}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active-pill"
            className="absolute inset-0 rounded-xl bg-brand-50"
            style={{ zIndex: -1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <Icon
          size={16}
          aria-hidden="true"
          className={cn(
            'shrink-0 transition-colors',
            active ? 'text-brand-600' : 'text-earth-400 group-hover:text-earth-600',
          )}
        />
        <span className="flex-1">{item.label}</span>
        {active && (
          <motion.div
            layoutId="sidebar-active-dot"
            className="h-1.5 w-1.5 rounded-full bg-brand-500"
            transition={{ duration: 0.3 }}
          />
        )}
      </Link>
    </motion.li>
  )
}

export function DashboardFrame({ user, children, showOnboarding = false }: DashboardFrameProps) {
  const pathname = usePathname()
  const items = navConfig[user.role]
  const initial = user.name.charAt(0).toUpperCase()

  const isActive = (href: string) => {
    const exactRoots = ['/dashboard/customer', '/dashboard/worker', '/dashboard/admin']
    if (exactRoots.includes(href)) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* One-time onboarding modal — only shown to users who haven't seen it yet */}
      {showOnboarding && (user.role === 'WORKER' || user.role === 'CUSTOMER') && (
        <OnboardingModal role={user.role} userName={user.name} />
      )}

      <Navbar user={user} />

      <div className="mx-auto flex w-full max-w-6xl gap-0 px-0 md:gap-6 md:px-6 md:py-6">
        {/* ── Sidebar (desktop) ── */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="hidden w-60 shrink-0 md:block"
        >
          <div className="sticky top-24 overflow-hidden rounded-2xl border border-earth-200/80 bg-white shadow-card">
            {/* User card */}
            <div className="border-b border-earth-100 p-4">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
                  <span className="relative text-sm font-black text-white">{initial}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                  className="min-w-0"
                >
                  <div className="truncate text-sm font-bold text-earth-900">{user.name}</div>
                  <div className="text-[11px] font-medium text-earth-500">{roleLabels[user.role]}</div>
                </motion.div>
              </div>
            </div>

            {/* Nav links */}
            <div className="p-2">
              <nav aria-label="Dashboard navigation">
                <ul className="space-y-0.5">
                  {items.map((item, i) => (
                    <NavItem key={item.href} item={item} active={isActive(item.href)} index={i} />
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </motion.aside>

        {/* ── Mobile header + tabs ── */}
        <div className="w-full md:hidden">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="border-b border-earth-200 bg-white shadow-sm"
          >
            <div className="bg-earth-950 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
                    <span className="relative text-xs font-black text-white">{initial}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                </div>
                <span className="rounded-full border border-brand-700/40 bg-brand-900/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-300">
                  {roleLabels[user.role]}
                </span>
              </div>
            </div>
            <div
              className="flex gap-1.5 overflow-x-auto px-4 py-2 pb-3"
              role="tablist"
              aria-label="Dashboard sections"
            >
              {items.map(({ icon: Icon, ...item }) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="tab"
                  aria-selected={isActive(item.href)}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors',
                    isActive(item.href)
                      ? 'border-brand-200 bg-brand-50 text-brand-700'
                      : 'border-earth-200 bg-white text-earth-600 hover:border-earth-300 hover:bg-earth-50',
                  )}
                >
                  <Icon size={13} aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <main className="px-4 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* ── Desktop content ── */}
        <main className="hidden min-w-0 flex-1 md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
