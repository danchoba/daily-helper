import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function CustomerDashboard() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'CUSTOMER') redirect('/dashboard/' + session.role.toLowerCase())

  const [activeJobs, recentJobs] = await Promise.all([
    prisma.job.count({ where: { customerId: session.id, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    prisma.job.findMany({
      where: { customerId: session.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } }
    })
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">Welcome back, {session.name.split(' ')[0]}!</h1>
            <p className="text-earth-500 mt-1">Manage your jobs and find local helpers</p>
          </div>
          <Link href="/dashboard/customer/jobs/new" className="btn-primary">+ Post a Job</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Active Jobs', value: activeJobs, href: '/dashboard/customer/jobs', icon: '📋' },
            { label: 'Post New Job', value: '→', href: '/dashboard/customer/jobs/new', icon: '✏️' },
            { label: 'My Reviews', value: '→', href: '/dashboard/customer/reviews', icon: '⭐' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="card hover:shadow-md transition-shadow text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-2xl font-bold text-earth-900 mb-1">{item.value}</div>
              <div className="text-sm text-earth-500">{item.label}</div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Your Jobs</h2>
          <Link href="/dashboard/customer/jobs" className="text-brand-600 text-sm hover:underline">View all →</Link>
        </div>

        {recentJobs.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No jobs yet"
            description="Post your first job and start getting applications from local helpers."
            action={<Link href="/dashboard/customer/jobs/new" className="btn-primary">Post a Job</Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {recentJobs.map(job => <JobCard key={job.id} job={job} showStatus />)}
          </div>
        )}
      </div>
    </div>
  )
}
