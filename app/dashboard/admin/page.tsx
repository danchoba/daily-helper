import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const [totalUsers, totalJobs, pendingVerifications, pendingPayments] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'PENDING' } })
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="page-title mb-2">Admin Dashboard</h1>
        <p className="text-earth-500 mb-8">Manage users, jobs, verifications, and payments</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: totalUsers, href: '/dashboard/admin/users', icon: '👥', color: 'text-blue-600' },
            { label: 'Total Jobs', value: totalJobs, href: '/dashboard/admin/jobs', icon: '📋', color: 'text-earth-700' },
            { label: 'Pending Verifications', value: pendingVerifications, href: '/dashboard/admin/verifications', icon: '🪪', color: pendingVerifications > 0 ? 'text-orange-600' : 'text-earth-400' },
            { label: 'Pending Payments', value: pendingPayments, href: '/dashboard/admin/payments', icon: '💳', color: pendingPayments > 0 ? 'text-red-600' : 'text-earth-400' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="card hover:shadow-md transition-shadow text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className={`text-3xl font-bold mb-1 ${item.color}`}>{item.value}</div>
              <div className="text-xs text-earth-500">{item.label}</div>
              {(item.label.includes('Pending') && (item.value as number) > 0) && (
                <div className="mt-2"><span className="badge bg-orange-100 text-orange-700">Needs action</span></div>
              )}
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: 'Manage Users', desc: 'View all customers and workers', href: '/dashboard/admin/users', icon: '👥' },
            { title: 'Manage Jobs', desc: 'View and moderate all jobs', href: '/dashboard/admin/jobs', icon: '📋' },
            { title: 'Verification Requests', desc: `${pendingVerifications} pending review`, href: '/dashboard/admin/verifications', icon: '🪪' },
            { title: 'Payment Records', desc: `${pendingPayments} awaiting approval`, href: '/dashboard/admin/payments', icon: '💳' },
          ].map(item => (
            <Link key={item.title} href={item.href} className="card hover:shadow-md transition-shadow flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-earth-100 flex items-center justify-center text-2xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-earth-900">{item.title}</h3>
                <p className="text-earth-500 text-sm">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
