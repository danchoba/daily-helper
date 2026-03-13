import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { LayoutDashboard, Briefcase, Star, Plus } from 'lucide-react'

export default async function CustomerDashLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'customer') redirect('/dashboard/worker')

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-52 flex-shrink-0">
            <div className="card p-4">
              <p className="text-xs font-bold text-earth-400 uppercase tracking-wide mb-4">Customer Menu</p>
              <nav className="space-y-1">
                <NavItem href="/dashboard/customer" icon={<LayoutDashboard size={15} />} label="Overview" />
                <NavItem href="/dashboard/customer/jobs" icon={<Briefcase size={15} />} label="My Jobs" />
                <NavItem href="/dashboard/customer/jobs/new" icon={<Plus size={15} />} label="Post a Job" />
                <NavItem href="/dashboard/customer/reviews" icon={<Star size={15} />} label="My Reviews" />
              </nav>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-earth-600 hover:bg-brand-50 hover:text-brand-700 transition-colors">
      {icon}{label}
    </Link>
  )
}
