import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/ui/EmptyState'
import Link from 'next/link'

export default async function CustomerJobsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const jobs = await prisma.job.findMany({
    where: { customerId: session.id },
    include: { category: true, customer: { select: { name: true } }, _count: { select: { applications: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard/customer" className="text-earth-500 text-sm hover:text-earth-700">← Dashboard</Link>
            <h1 className="page-title mt-1">My Jobs</h1>
          </div>
          <Link href="/dashboard/customer/jobs/new" className="btn-primary">+ New Job</Link>
        </div>
        {jobs.length === 0 ? (
          <EmptyState icon="📋" title="No jobs yet" description="Post your first job to find local helpers."
            action={<Link href="/dashboard/customer/jobs/new" className="btn-primary">Post a Job</Link>} />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <div key={job.id} className="relative">
                <JobCard job={job} showStatus />
                <div className="px-2 pb-2 -mt-1">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-outline btn-sm flex-1 text-center text-xs">
                      Applicants ({job._count.applications})
                    </Link>
                    <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-outline btn-sm text-xs">Edit</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
