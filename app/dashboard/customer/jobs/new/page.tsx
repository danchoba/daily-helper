import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { NewJobForm } from './NewJobForm'
import { prisma } from '@/lib/prisma'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

export default async function NewJobPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-3xl">
        <Breadcrumbs items={[
          { label: 'Dashboard', href: '/dashboard/customer' },
          { label: 'My Jobs', href: '/dashboard/customer/jobs' },
          { label: 'Post new job' },
        ]} />
        <h1 className="page-title mb-6">Post a new job</h1>
        <NewJobForm categories={categories} />
    </div>
  )
}
