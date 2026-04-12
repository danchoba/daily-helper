import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { NewJobForm } from './NewJobForm'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

interface PageProps {
  searchParams: Promise<{ from?: string }>
}

export default async function NewJobPage({ searchParams }: PageProps) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const { from } = await searchParams

  const [categories, sourceJob] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    from
      ? prisma.job.findUnique({
          where: { id: from, customerId: session.id },
          select: { title: true, description: true, categoryId: true, area: true, budget: true, urgency: true },
        })
      : Promise.resolve(null),
  ])

  return (
    <div className="max-w-3xl">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard/customer' },
          { label: 'My Jobs', href: '/dashboard/customer/jobs' },
          { label: from ? 'Repost job' : 'Post new job' },
        ]} />
        <h1 className="page-title mb-6">{from ? 'Repost a similar job' : 'Post a new job'}</h1>
        {from && sourceJob && (
          <div className="mb-4 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
            Pre-filled from a previous listing — update any details before posting.
          </div>
        )}
        <NewJobForm categories={categories} initialData={sourceJob ?? undefined} />
    </div>
  )
}
