import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface DashboardLayoutProps {
  title: string
  navItems: NavItem[]
  children: React.ReactNode
}

export function DashboardLayout({ title, navItems, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-earth-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 flex-shrink-0">
            <div className="card p-4">
              <h2 className="font-display font-bold text-earth-800 mb-4 text-sm uppercase tracking-wide">{title}</h2>
              <nav className="space-y-1">
                {navItems.map(item => (
                  <DashNavLink key={item.href} href={item.href} icon={item.icon}>{item.label}</DashNavLink>
                ))}
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

function DashNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  // Using a client component pattern - we need pathname
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-earth-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
    >
      {icon}{children}
    </Link>
  )
}
