import Link from 'next/link'
import { Plus, SquareStack } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function CustomerJobsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const jobs = await prisma.job.findMany({
    where: { customerId: session.id },
    include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/dashboard/customer" className="subtle-link inline-flex items-center gap-2">Back to dashboard</Link>
            <div className="mt-3">
              <div className="kicker mb-2">Customer jobs</div>
              <h1 className="page-title">My jobs</h1>
            </div>
          </div>
          <Link href="/dashboard/customer/jobs/new" className="btn-primary">
            <Plus size={16} />
            New job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            icon={<SquareStack size={22} />}
            title="No jobs posted yet"
            description="Create your first job to start receiving applications from local workers."
            action={<Link href="/dashboard/customer/jobs/new" className="btn-primary">Post a job</Link>}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map(job => (
              <div key={job.id} className="space-y-3">
                <JobCard job={job} showStatus />
                <div className="flex gap-3">
                  <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-outline flex-1 text-center">
                    Applicants ({job._count.applications})
                  </Link>
                  <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-outline">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
