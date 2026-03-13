import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { JobCard } from '@/components/jobs/JobCard'
import { CategoryFilter } from '@/components/jobs/CategoryFilter'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'

interface PageProps { searchParams: { category?: string; area?: string } }

export default async function WorkerBrowseJobsPage({ searchParams }: PageProps) {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')
  const { category, area } = searchParams

  // Get already applied job IDs
  const myApplications = await prisma.jobApplication.findMany({
    where: { workerId: session.id },
    select: { jobId: true }
  })
  const appliedJobIds = new Set(myApplications.map(a => a.jobId))

  const [jobs, categories] = await Promise.all([
    prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(category ? { category: { slug: category } } : {}),
        ...(area ? { area: { contains: area, mode: 'insensitive' } } : {}),
      },
      include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }]
    }),
    prisma.category.findMany()
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard/worker" className="text-earth-500 text-sm">← Dashboard</Link>
        <h1 className="page-title mt-2 mb-6">Browse Jobs</h1>
        <div className="mb-6">
          <CategoryFilter categories={categories} />
        </div>
        {jobs.length === 0 ? (
          <EmptyState icon="🔍" title="No jobs found" description="No open jobs match your filters right now." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="relative">
                <JobCard job={job} />
                {appliedJobIds.has(job.id) && (
                  <div className="absolute top-3 right-3">
                    <span className="badge bg-sage-100 text-sage-800 text-xs">✓ Applied</span>
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
