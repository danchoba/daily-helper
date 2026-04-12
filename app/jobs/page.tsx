import Link from 'next/link'
import { JobStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { JobFiltersClient } from '@/components/jobs/JobFiltersClient'
import { EmptyState } from '@/components/ui/EmptyState'

import { Pagination } from '@/components/ui/Pagination'

interface PageProps {
  searchParams: Promise<{ category?: string; area?: string; sort?: string; q?: string; page?: string }>
}

const PAGE_SIZE = 12

export default async function JobsPage({ searchParams }: PageProps) {
  const session = await getServerSession()
  const { category, area, sort = 'urgency', q, page } = await searchParams
  const currentPage = Math.max(1, parseInt(page || '1', 10))

  const orderBy = (() => {
    if (sort === 'newest') return [{ createdAt: 'desc' as const }]
    if (sort === 'budget_high') return [{ budget: 'desc' as const }, { createdAt: 'desc' as const }]
    if (sort === 'budget_low') return [{ budget: 'asc' as const }, { createdAt: 'desc' as const }]
    return [{ urgency: 'desc' as const }, { createdAt: 'desc' as const }]
  })()

  const where = {
    status: JobStatus.OPEN,
    ...(category ? { category: { slug: category } } : {}),
    ...(area ? { area: { contains: area, mode: 'insensitive' as const } } : {}),
    ...(q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const [total, jobs, categories] = await Promise.all([
    prisma.job.count({ where }),
    prisma.job.findMany({
      where,
      include: {
        category: true,
        customer: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy,
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  // Re-sort budget in JS to correctly handle null budgets
  const sortedJobs = sort === 'budget_high'
    ? [...jobs].sort((a, b) => (b.budget ?? -1) - (a.budget ?? -1))
    : sort === 'budget_low'
      ? [...jobs].sort((a, b) => (a.budget ?? Infinity) - (b.budget ?? Infinity))
      : jobs

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="page-shell">
        <div className="mb-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-200/60 bg-brand-50 px-3 py-1">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-brand-600">Marketplace</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-earth-950 md:text-4xl">Open jobs near you</h1>
              <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-earth-500">
                Browse active local listings, check the details, and apply with a short intro.
              </p>
            </div>
            {session?.role === 'CUSTOMER' ? (
              <Link href="/dashboard/customer/jobs/new" className="btn-primary">
                Post a job
              </Link>
            ) : !session ? (
              <Link href="/signup" className="btn-primary">
                Get started free
              </Link>
            ) : null}
          </div>
        </div>

        <JobFiltersClient categories={categories} totalJobs={sortedJobs.length} />

        {sortedJobs.length === 0 ? (
          <EmptyState
            title="No jobs match these filters"
            description="Try another category or area, or check back later as new jobs are posted."
            action={
              <Link
                href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'}
                className="btn-primary"
              >
                {session?.role === 'CUSTOMER' ? 'Post a job' : 'Get started'}
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              {sortedJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
            <Pagination
              total={total}
              pageSize={PAGE_SIZE}
              currentPage={currentPage}
              basePath="/jobs"
              searchParams={searchParams as Record<string, string>}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
