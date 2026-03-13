import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { NewJobForm } from './NewJobForm'
import { prisma } from '@/lib/prisma'

export default async function NewJobPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="max-w-3xl">
        <Link href="/dashboard/customer/jobs" className="subtle-link inline-flex items-center gap-2">Back to my jobs</Link>
        <h1 className="page-title mt-3 mb-6">Post a new job</h1>
        <NewJobForm categories={categories} />
    </div>
  )
}
