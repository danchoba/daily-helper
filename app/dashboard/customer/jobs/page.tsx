import Link from 'next/link'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { CustomerJobsList } from './CustomerJobsList'

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
          <div className="kicker mb-2">Customer jobs</div>
          <h1 className="page-title">My jobs</h1>
        </div>
        <Link href="/dashboard/customer/jobs/new" className="btn-primary">
          <Plus size={16} aria-hidden="true" />
          New job
        </Link>
      </div>

      <CustomerJobsList jobs={jobs} />
    </div>
  )
}
