import Link from 'next/link'
import { ClipboardList, MessageSquareText, Plus, SquareStack } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
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
      include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
    }),
  ])
  const jobsWithApplicants = recentJobs.filter(job => (job._count?.applications || 0) > 0).length

  const stats = [
    {
      label: 'Active jobs',
      value: activeJobs.toString(),
      href: '/dashboard/customer/jobs',
      icon: ClipboardList,
      description: 'Jobs currently open or in progress',
    },
    {
      label: 'Post a new job',
      value: 'Create',
      href: '/dashboard/customer/jobs/new',
      icon: Plus,
      description: 'Publish a new listing for workers nearby',
    },
    {
      label: 'Review activity',
      value: 'Manage',
      href: '/dashboard/customer/reviews',
      icon: MessageSquareText,
      description: 'Track completed work and submitted feedback',
    },
  ]

  return (
    <div>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="kicker mb-2">Customer dashboard</div>
            <h1 className="page-title">Welcome back, {session.name.split(' ')[0]}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-earth-500">
              Track your jobs, review applicants, and move from posting to hiring with a clearer workflow.
            </p>
          </div>
          <Link href="/dashboard/customer/jobs/new" className="btn-primary">
            <Plus size={16} />
            Post a job
          </Link>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-[1.2fr,0.8fr]">
          <div className="card">
            <div className="kicker mb-2">Overview</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Hiring activity this week</h2>
            <p className="mt-2 text-sm leading-6 text-earth-500">
              Stay focused on open roles and jobs that already have applicant activity.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="muted-panel p-4">
                <div className="kicker mb-1">Open or active</div>
                <div className="text-2xl font-extrabold tracking-tight text-earth-950">{activeJobs}</div>
              </div>
              <div className="muted-panel p-4">
                <div className="kicker mb-1">With applicants</div>
                <div className="text-2xl font-extrabold tracking-tight text-earth-950">{jobsWithApplicants}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="kicker mb-2">Recommended next step</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Keep job details specific</h2>
            <p className="mt-2 text-sm leading-6 text-earth-500">
              Clear budgets, locations, and descriptions improve worker response quality and reduce back-and-forth.
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
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

        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="kicker mb-1">Recent jobs</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Your latest listings</h2>
          </div>
          <Link href="/dashboard/customer/jobs" className="subtle-link">
            View all jobs
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
  )
}
