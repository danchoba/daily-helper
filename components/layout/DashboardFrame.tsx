'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BriefcaseBusiness, ClipboardList, CreditCard, ShieldCheck, Star, UserRound, Users, type LucideIcon } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { cn } from '@/lib/utils'

type Role = 'CUSTOMER' | 'WORKER' | 'ADMIN'

interface DashboardFrameProps {
  user: { id: string; name: string; role: Role }
  children: React.ReactNode
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
    { label: 'Payments', href: '/dashboard/admin/payments', icon: CreditCard },
    { label: 'Verifications', href: '/dashboard/admin/verifications', icon: ShieldCheck },
  ],
}

export function DashboardFrame({ user, children }: DashboardFrameProps) {
  const pathname = usePathname()
  const items = navConfig[user.role]
  const roleLabel = user.role === 'CUSTOMER' ? 'Customer workspace' : user.role === 'WORKER' ? 'Worker workspace' : 'Admin workspace'

  return (
    <div className="min-h-screen bg-earth-50">
      <Navbar user={user} />
      <div className="border-b border-earth-200 bg-white/85 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-6">
          <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">{roleLabel}</div>
              <div className="mt-1 text-sm text-earth-700">Signed in as <span className="font-semibold text-earth-900">{user.name}</span></div>
            </div>
            <div className="inline-flex self-start rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-700">
              {user.role}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {items.map(({ icon: Icon, ...item }) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex shrink-0 items-center gap-2 rounded-xl border border-earth-200 bg-white px-4 py-2.5 text-sm font-semibold text-earth-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700',
                  (pathname === item.href || (item.href !== '/dashboard/customer' && item.href !== '/dashboard/worker' && item.href !== '/dashboard/admin' && pathname.startsWith(item.href))) &&
                    'border-brand-200 bg-brand-50 text-brand-700 shadow-sm'
                )}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="page-shell">{children}</div>
    </div>
  )
}
