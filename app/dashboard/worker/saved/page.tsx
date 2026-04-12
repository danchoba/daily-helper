import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Bookmark } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SaveJobButton } from '@/components/jobs/SaveJobButton'

export default async function SavedJobsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')

  const saved = await prisma.savedJob.findMany({
    where: { userId: session.id },
    include: {
      job: {
        include: {
          category: true,
          customer: { select: { name: true } },
          _count: { select: { applications: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const activeJobs = saved.filter(s => s.job.status === 'OPEN')
  const otherJobs = saved.filter(s => s.job.status !== 'OPEN')

  return (
    <div>
      <Link href="/dashboard/worker" className="subtle-link inline-flex items-center gap-2">Back to dashboard</Link>
      <div className="mb-6 mt-3">
        <div className="kicker mb-2">Saved jobs</div>
        <h1 className="page-title">Bookmarked listings</h1>
        <p className="mt-1.5 text-sm text-earth-500">{saved.length} saved job{saved.length !== 1 ? 's' : ''}</p>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          icon={<Bookmark size={22} />}
          title="No saved jobs yet"
          description="Bookmark jobs you're interested in so you can find them quickly later."
          action={<Link href="/dashboard/worker/jobs" className="btn-primary">Browse jobs</Link>}
        />
      ) : (
        <div className="space-y-8">
          {activeJobs.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">Open jobs</p>
              <div className="grid gap-4 md:grid-cols-2">
                {activeJobs.map(s => (
                  <div key={s.id} className="relative">
                    <JobCard job={s.job} />
                    <div className="absolute right-4 top-4">
                      <SaveJobButton jobId={s.job.id} initialSaved />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherJobs.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">No longer open</p>
              <div className="grid gap-4 md:grid-cols-2 opacity-60">
                {otherJobs.map(s => (
                  <div key={s.id} className="relative">
                    <JobCard job={s.job} showStatus />
                    <div className="absolute right-4 top-4">
                      <SaveJobButton jobId={s.job.id} initialSaved />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
