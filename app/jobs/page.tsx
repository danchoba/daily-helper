import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { CategoryFilter } from '@/components/jobs/CategoryFilter'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'
import { JobStatus } from '@prisma/client'

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
        _count: { select: { applications: true } }
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }]
    }),
    prisma.category.findMany()
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title">Open Jobs</h1>
            <p className="text-earth-500 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} available{area ? ` in ${area}` : ''}</p>
          </div>
          {session?.role === 'CUSTOMER' && (
            <Link href="/dashboard/customer/jobs/new" className="btn-primary btn-sm">+ Post Job</Link>
          )}
          {!session && (
            <Link href="/signup" className="btn-primary btn-sm">Post a Job</Link>
          )}
        </div>

        <div className="mb-6 space-y-3">
          <CategoryFilter categories={categories} />
          <div className="flex gap-2">
            <input
              placeholder="Filter by area..."
              defaultValue={area}
              className="input max-w-xs"
              id="areaSearch"
            />
          </div>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No jobs found"
            description="No open jobs match your filters right now. Check back soon or post your own."
            action={<Link href="/signup" className="btn-primary">Post a Job</Link>}
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
