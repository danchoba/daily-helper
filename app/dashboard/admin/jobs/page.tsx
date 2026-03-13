import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatBWP, timeAgo, jobStatusLabel, statusColor } from '@/lib/utils'
import { AdminJobActions } from './AdminJobActions'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function AdminJobsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const jobs = await prisma.job.findMany({
    include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-5xl">
      <Link href="/dashboard/admin" className="subtle-link inline-flex items-center gap-2">Back to admin</Link>
      <h1 className="page-title mt-3 mb-6">Jobs ({jobs.length})</h1>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs available" description="Jobs will appear here when customers create listings." />
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Link href={`/jobs/${job.id}`} className="text-base font-bold tracking-tight text-earth-950 hover:text-brand-700">
                      {job.title}
                    </Link>
                    <span className={`badge ${statusColor(job.status)}`}>{jobStatusLabel(job.status)}</span>
                  </div>
                  <div className="grid gap-2 text-sm text-earth-500 md:grid-cols-2">
                    <div>Customer: <span className="font-medium text-earth-800">{job.customer.name}</span></div>
                    <div>Category: <span className="font-medium text-earth-800">{job.category.name}</span></div>
                    <div>Area: <span className="font-medium text-earth-800">{job.area}</span></div>
                    <div>Budget: <span className="font-medium text-earth-800">{formatBWP(job.budget)}</span></div>
                    <div>Applicants: <span className="font-medium text-earth-800">{job._count.applications}</span></div>
                    <div>Posted: <span className="font-medium text-earth-800">{timeAgo(job.createdAt)}</span></div>
                  </div>
                </div>
                <AdminJobActions jobId={job.id} currentStatus={job.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
