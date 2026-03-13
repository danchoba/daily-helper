import Link from 'next/link'
import { JobStatus } from '@prisma/client'
import { MapPin, Search } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { CategoryFilter } from '@/components/jobs/CategoryFilter'
import { EmptyState } from '@/components/ui/EmptyState'

interface PageProps {
  searchParams: { category?: string; area?: string }
}

export default async function JobsPage({ searchParams }: PageProps) {
  const session = await getServerSession()
  const { category, area } = searchParams

  const [jobs, categories] = await Promise.all([
    prisma.job.findMany({
      where: {
        status: JobStatus.OPEN,
        ...(category ? { category: { slug: category } } : {}),
        ...(area ? { area: { contains: area, mode: 'insensitive' } } : {}),
      },
      include: {
        category: true,
        customer: { select: { name: true } },
        _count: { select: { applications: true } },
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="page-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="kicker mb-2">Marketplace</div>
            <h1 className="page-title">Open jobs</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-earth-500">
              Browse active local jobs, review the details, and apply with a short introduction.
            </p>
          </div>
          {session?.role === 'CUSTOMER' ? (
            <Link href="/dashboard/customer/jobs/new" className="btn-primary">
              Post a job
            </Link>
          ) : !session ? (
            <Link href="/signup" className="btn-primary">
              Create an account
            </Link>
          ) : null}
        </div>

        <div className="surface-card mb-6 p-4 md:p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-earth-900">
                {jobs.length} open job{jobs.length === 1 ? '' : 's'}
              </div>
              <div className="text-sm text-earth-500">
                {area ? `Filtered by area: ${area}` : 'Use category and area filters to narrow the list.'}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <CategoryFilter categories={categories} />
          </div>
          <form action="/jobs" className="grid gap-3 md:grid-cols-[1fr,auto]">
            {category && <input type="hidden" name="category" value={category} />}
            <label className="relative block">
              <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" />
              <input
                type="text"
                name="area"
                placeholder="Filter by area"
                defaultValue={area}
                className="input pl-10"
              />
            </label>
            <button type="submit" className="btn-outline">
              <Search size={16} />
              Apply filters
            </button>
          </form>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs match these filters"
            description="Try another category or area, or check back later as new jobs are posted."
            action={<Link href={session ? '/dashboard/customer/jobs/new' : '/signup'} className="btn-primary">Post a job</Link>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
