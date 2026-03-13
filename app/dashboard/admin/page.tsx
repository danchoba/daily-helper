import Link from 'next/link'
import { CreditCard, ShieldCheck, Users, BriefcaseBusiness } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function AdminDashboard() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const [totalUsers, totalJobs, pendingVerifications, pendingPayments] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'PENDING' } }),
  ])

  const stats = [
    {
      label: 'Users',
      value: totalUsers.toString(),
      href: '/dashboard/admin/users',
      icon: Users,
      description: 'Customers and workers on the platform',
    },
    {
      label: 'Jobs',
      value: totalJobs.toString(),
      href: '/dashboard/admin/jobs',
      icon: BriefcaseBusiness,
      description: 'Total jobs created across the marketplace',
    },
    {
      label: 'Pending verifications',
      value: pendingVerifications.toString(),
      href: '/dashboard/admin/verifications',
      icon: ShieldCheck,
      description: 'Verification requests awaiting review',
    },
    {
      label: 'Pending payments',
      value: pendingPayments.toString(),
      href: '/dashboard/admin/payments',
      icon: CreditCard,
      description: 'Manual payment checks that need attention',
    },
  ]

  return (
    <div>
        <div className="mb-8">
          <div className="kicker mb-2">Admin</div>
          <h1 className="page-title">Operations dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-earth-500">
            Review the high-risk queues first. Verification and payment actions affect trust and access across the platform.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ icon: Icon, ...item }) => (
            <Link key={item.label} href={item.href} className="surface-card p-5 transition-colors hover:border-earth-300 hover:bg-earth-50">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-earth-100 text-earth-900">
                <Icon size={18} />
              </div>
              <div className="stat-value">{item.value}</div>
              <div className="mt-1 text-sm font-semibold text-earth-900">{item.label}</div>
              <div className="mt-2 text-sm leading-6 text-earth-500">{item.description}</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/admin/verifications" className="card transition-colors hover:border-earth-300 hover:bg-earth-50">
            <div className="kicker mb-2">Priority queue</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Verification reviews</h2>
            <p className="mt-2 text-sm leading-6 text-earth-600">
              Approve or reject worker verification requests with clear operational context.
            </p>
          </Link>

          <Link href="/dashboard/admin/payments" className="card transition-colors hover:border-earth-300 hover:bg-earth-50">
            <div className="kicker mb-2">Priority queue</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Manual payment approvals</h2>
            <p className="mt-2 text-sm leading-6 text-earth-600">
              Validate references before unlocking worker contact details or verification status.
            </p>
          </Link>
        </div>
    </div>
  )
}
