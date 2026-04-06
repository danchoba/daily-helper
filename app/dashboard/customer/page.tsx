import Link from 'next/link'
import { ClipboardList, MessageSquareText, Plus, SquareStack, TrendingUp, Users } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { StatCard, StatGrid } from '@/components/dashboard/StatCard'

export default async function CustomerDashboard() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'CUSTOMER') redirect('/dashboard/' + session.role.toLowerCase())

  const [activeJobs, completedJobs, recentJobs] = await Promise.all([
    prisma.job.count({ where: { customerId: session.id, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    prisma.job.count({ where: { customerId: session.id, status: 'COMPLETED' } }),
    prisma.job.findMany({
      where: { customerId: session.id },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
    }),
  ])
  const jobsWithApplicants = recentJobs.filter(job => (job._count?.applications || 0) > 0).length
  const firstName = session.name.split(' ')[0]

  const stats = [
    {
      label: 'Active jobs',
      value: activeJobs.toString(),
      href: '/dashboard/customer/jobs',
      icon: <ClipboardList size={18} aria-hidden="true" />,
      description: activeJobs > 0 ? `${activeJobs} job${activeJobs !== 1 ? 's' : ''} open or in progress — manage now` : 'No active jobs — post one to get started',
    },
    {
      label: 'Post a new job',
      value: 'New +',
      href: '/dashboard/customer/jobs/new',
      icon: <Plus size={18} aria-hidden="true" />,
      description: 'Create a listing and reach local workers',
    },
    {
      label: 'Review activity',
      value: 'Manage',
      href: '/dashboard/customer/reviews',
      icon: <MessageSquareText size={18} aria-hidden="true" />,
      description: completedJobs > 0 ? `${completedJobs} completed job${completedJobs !== 1 ? 's' : ''} — leave a review` : 'Reviews appear after jobs are completed',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Customer dashboard</p>
          <h1 className="text-2xl font-black tracking-tight text-earth-950 md:text-3xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-earth-500">
            Track your jobs, review applicants, and move from posting to hiring.
          </p>
        </div>
        <Link href="/dashboard/customer/jobs/new" className="btn-primary">
          <Plus size={16} />
          Post a job
        </Link>
      </div>

      {/* Activity summary */}
      <div className="grid gap-4 md:grid-cols-[1.3fr,0.7fr]">
        <div className="overflow-hidden rounded-2xl border border-earth-200/80 bg-white p-6 shadow-card">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-earth-400">Activity overview</p>
          <h2 className="text-lg font-bold tracking-tight text-earth-950">Hiring at a glance</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: 'Open / Active', value: activeJobs, icon: TrendingUp, color: 'text-brand-600 bg-brand-50' },
              { label: 'With applicants', value: jobsWithApplicants, icon: Users, color: 'text-sage-600 bg-sage-50' },
              { label: 'Completed', value: completedJobs, icon: ClipboardList, color: 'text-accent-600 bg-accent-50' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border border-earth-100 bg-earth-50/60 p-3 text-center">
                <div className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={14} />
                </div>
                <div className="text-xl font-extrabold tracking-tight text-earth-950">{value}</div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-earth-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-accent-50 p-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-400">Pro tip</p>
            <h2 className="text-base font-bold tracking-tight text-earth-950">Be specific to win better applicants</h2>
            <p className="mt-2 text-sm leading-relaxed text-earth-500">
              Clear budgets, locations, and task descriptions dramatically improve worker response quality.
            </p>
          </div>
          <Link href="/dashboard/customer/jobs/new" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700">
            <Plus size={14} />
            Post a job
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <StatGrid className="md:grid-cols-3">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </StatGrid>

      {/* Recent jobs */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-earth-400">Recent activity</p>
            <h2 className="text-lg font-bold tracking-tight text-earth-950">Your latest listings</h2>
          </div>
          <Link href="/dashboard/customer/jobs" className="subtle-link">
            View all
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <EmptyState
            icon={<SquareStack size={22} />}
            title="No jobs posted yet"
            description="Create your first listing to start receiving applications from local workers."
            action={<Link href="/dashboard/customer/jobs/new" className="btn-primary">Post a job</Link>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentJobs.map(job => <JobCard key={job.id} job={job} showStatus />)}
          </div>
        )}
      </div>
    </div>
  )
}
