import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { formatBWP, timeAgo, jobStatusLabel, statusColor } from '@/lib/utils'
import { AdminJobActions } from './AdminJobActions'

export default async function AdminJobsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const jobs = await prisma.job.findMany({
    include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard/admin" className="text-earth-500 text-sm">← Admin</Link>
        <h1 className="page-title mt-2 mb-6">Jobs ({jobs.length})</h1>
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link href={`/jobs/${job.id}`} className="font-semibold text-earth-900 hover:text-brand-600">{job.title}</Link>
                    <span className={`badge ${statusColor(job.status)}`}>{jobStatusLabel(job.status)}</span>
                  </div>
                  <div className="text-xs text-earth-500">
                    By {job.customer.name} · {job.category.name} · {job.area} · {job._count.applications} applicants · {formatBWP(job.budget)} · {timeAgo(job.createdAt)}
                  </div>
                </div>
                <AdminJobActions jobId={job.id} currentStatus={job.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
