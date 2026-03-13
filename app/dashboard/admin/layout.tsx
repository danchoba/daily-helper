import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { LayoutDashboard, Users, Briefcase, ShieldCheck, CreditCard } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session?.user) redirect('/login')
  if (session.user.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 flex-shrink-0">
            <div className="card p-4">
              <p className="text-xs font-bold text-earth-400 uppercase tracking-wide mb-1">Admin Panel</p>
              <p className="text-xs text-earth-400 mb-4">Daily Helper Admin</p>
              <nav className="space-y-1">
                {[
                  { href: '/dashboard/admin', icon: <LayoutDashboard size={15} />, label: 'Overview' },
                  { href: '/dashboard/admin/users', icon: <Users size={15} />, label: 'Users' },
                  { href: '/dashboard/admin/jobs', icon: <Briefcase size={15} />, label: 'Jobs' },
                  { href: '/dashboard/admin/verifications', icon: <ShieldCheck size={15} />, label: 'Verifications' },
                  { href: '/dashboard/admin/payments', icon: <CreditCard size={15} />, label: 'Payments' },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-earth-600 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                    {item.icon}{item.label}
                  </Link>
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
