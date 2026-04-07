import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { JobCard } from '@/components/jobs/JobCard'
import { JobFiltersClient } from '@/components/jobs/JobFiltersClient'
import { EmptyState } from '@/components/ui/EmptyState'

interface PageProps {
  searchParams: { category?: string; area?: string; q?: string }
}

export default async function WorkerBrowseJobsPage({ searchParams }: PageProps) {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')
  const { category, area, q } = searchParams

  const myApplications = await prisma.jobApplication.findMany({
    where: { workerId: session.id },
    select: { jobId: true },
  })
  const appliedJobIds = new Set(myApplications.map(application => application.jobId))

  const [jobs, categories] = await Promise.all([
    prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(category ? { category: { slug: category } } : {}),
        ...(area ? { area: { contains: area, mode: 'insensitive' } } : {}),
        ...(q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])
  const appliedCount = appliedJobIds.size

  return (
    <div>
        <Link href="/dashboard/worker" className="subtle-link inline-flex items-center gap-2">Back to dashboard</Link>
        <div className="mb-6 mt-3">
          <div className="kicker mb-2">Job discovery</div>
          <h1 className="page-title">Browse jobs</h1>
        </div>

        <JobFiltersClient
          categories={categories}
          totalJobs={jobs.length}
          basePath="/dashboard/worker/jobs"
        />

        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs match your filters"
            description="Adjust the filters or check back later as new jobs are posted."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map(job => (
              <div key={job.id} className="relative">
                <JobCard job={job} />
                {appliedJobIds.has(job.id) && (
                  <div className="absolute right-4 top-4">
                    <span className="inline-flex items-center gap-1 rounded-full border border-sage-200 bg-sage-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage-800">
                      <CheckCircle2 size={12} />
                      Applied
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
