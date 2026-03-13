import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { EmptyState } from '@/components/ui/EmptyState'
import { appStatusLabel, statusColor, timeAgo, formatBWP } from '@/lib/utils'
import Link from 'next/link'

export default async function WorkerApplicationsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')

  const applications = await prisma.jobApplication.findMany({
    where: { workerId: session.id },
    include: {
      job: {
        include: { category: true, customer: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard/worker" className="text-earth-500 text-sm">← Dashboard</Link>
        <h1 className="page-title mt-2 mb-6">My Applications</h1>
        {applications.length === 0 ? (
          <EmptyState icon="📋" title="No applications yet" description="Browse open jobs and apply to start working."
            action={<Link href="/dashboard/worker/jobs" className="btn-primary">Browse Jobs</Link>} />
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app.id} className="card">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <Link href={`/jobs/${app.jobId}`} className="font-semibold text-earth-900 hover:text-brand-600">{app.job.title}</Link>
                    <p className="text-xs text-earth-500 mt-0.5">📍 {app.job.area} · {app.job.category.name}</p>
                  </div>
                  <span className={`badge ${statusColor(app.status)} flex-shrink-0`}>{appStatusLabel(app.status)}</span>
                </div>
                <p className="text-earth-600 text-sm mb-3">"{app.message}"</p>
                <div className="flex items-center justify-between text-xs text-earth-400">
                  <span>Budget: {formatBWP(app.job.budget)}</span>
                  <span>Applied {timeAgo(app.createdAt)}</span>
                </div>
                {app.status === 'SELECTED' && (
                  <div className="mt-3 pt-3 border-t border-earth-100">
                    <span className="text-sage-700 font-medium text-sm">🎉 You were selected for this job! The customer will contact you shortly.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
