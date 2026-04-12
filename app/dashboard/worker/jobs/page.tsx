import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { JobCard } from '@/components/jobs/JobCard'
import { JobFiltersClient } from '@/components/jobs/JobFiltersClient'
import { EmptyState } from '@/components/ui/EmptyState'
import { Pagination } from '@/components/ui/Pagination'
import { SaveJobButton } from '@/components/jobs/SaveJobButton'

interface PageProps {
  searchParams: Promise<{ category?: string; area?: string; q?: string; page?: string }>
}

const PAGE_SIZE = 12

export default async function WorkerBrowseJobsPage({ searchParams }: PageProps) {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')
  const resolvedParams = await searchParams
  const { category, area, q, page } = resolvedParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const where = {
    status: 'OPEN' as const,
    ...(category ? { category: { slug: category } } : {}),
    ...(area ? { area: { contains: area, mode: 'insensitive' as const } } : {}),
    ...(q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const [total, jobs, categories, myApplications, mySaved] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.jobApplication.findMany({ where: { workerId: session.id }, select: { jobId: true } }),
    prisma.savedJob.findMany({ where: { userId: session.id }, select: { jobId: true } }),
  ])

  const appliedJobIds = new Set(myApplications.map(a => a.jobId))
  const savedJobIds = new Set(mySaved.map(s => s.jobId))

  return (
    <div>
      <Link href="/dashboard/worker" className="subtle-link inline-flex items-center gap-2">Back to dashboard</Link>
      <div className="mb-6 mt-3">
        <div className="kicker mb-2">Job discovery</div>
        <h1 className="page-title">Browse jobs</h1>
      </div>

      <JobFiltersClient
        categories={categories}
        totalJobs={total}
        basePath="/dashboard/worker/jobs"
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs match your filters"
          description="Adjust the filters or check back later as new jobs are posted."
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map(job => (
              <div key={job.id} className="relative">
                <JobCard job={job} />
                <div className="absolute right-4 top-4 flex items-center gap-2">
                  {appliedJobIds.has(job.id) && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-sage-200 bg-sage-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage-800">
                      <CheckCircle2 size={12} />
                      Applied
                    </span>
                  )}
                  <SaveJobButton jobId={job.id} initialSaved={savedJobIds.has(job.id)} />
                </div>
              </div>
            ))}
          </div>
          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            basePath="/dashboard/worker/jobs"
            searchParams={resolvedParams}
          />
        </>
      )}
    </div>
  )
}
