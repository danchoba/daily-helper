import Link from 'next/link'
import { AlertCircle, BriefcaseBusiness, ShieldCheck, Users } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { StatCard, StatGrid } from '@/components/dashboard/StatCard'

export default async function AdminDashboard() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const [totalUsers, totalJobs, pendingVerifications] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
  ])

  const stats = [
    {
      label: 'Total users',
      value: totalUsers.toString(),
      href: '/dashboard/admin/users',
      icon: <Users size={18} aria-hidden="true" />,
      description: 'Customers and workers on the platform',
    },
    {
      label: 'Total jobs',
      value: totalJobs.toString(),
      href: '/dashboard/admin/jobs',
      icon: <BriefcaseBusiness size={18} aria-hidden="true" />,
      description: 'All jobs created in the marketplace',
    },
    {
      label: 'Pending verifications',
      value: pendingVerifications.toString(),
      href: '/dashboard/admin/verifications',
      icon: <ShieldCheck size={18} aria-hidden="true" />,
      description: 'Verification requests awaiting review',
      highlight: pendingVerifications > 0,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-orange-500">Admin</p>
        <h1 className="text-2xl font-black tracking-tight text-earth-950 md:text-3xl">Operations dashboard</h1>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-earth-500">
          Manage users, jobs, and worker verification requests.
        </p>
      </div>

      {/* Alert banner */}
      {pendingVerifications > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-orange-500" />
          <div>
            <p className="text-sm font-bold text-orange-800">Action required</p>
            <p className="mt-0.5 text-xs text-orange-600">
              {pendingVerifications} verification{pendingVerifications > 1 ? 's' : ''} pending review
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <StatGrid className="md:grid-cols-3">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} highlight={stat.highlight} />
        ))}
      </StatGrid>

      {/* Priority queue */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-earth-400">Priority queue</p>
          {pendingVerifications > 0 && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-700">
              {pendingVerifications} pending
            </span>
          )}
        </div>
        <Link
          href="/dashboard/admin/verifications"
          className="group relative block overflow-hidden rounded-2xl border border-earth-200/80 bg-white p-6 shadow-card transition-all hover:border-brand-200 hover:shadow-card-hover"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-500 to-accent-400 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-sm">
            <ShieldCheck size={18} />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-earth-950">Verification reviews</h2>
          <p className="mt-2 text-sm leading-relaxed text-earth-500">
            Approve or reject worker verification requests to grant the Trusted badge.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-600 group-hover:gap-2 transition-all">
            Review now →
          </span>
        </Link>
      </div>
    </div>
  )
}
