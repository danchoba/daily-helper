import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { EditJobForm } from './EditJobForm'

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const [job, categories] = await Promise.all([
    prisma.job.findUnique({ where: { id: params.id, customerId: session.id }, include: { category: true } }),
    prisma.category.findMany(),
  ])

  if (!job) notFound()

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/customer/jobs" className="subtle-link inline-flex items-center gap-2">Back to my jobs</Link>
      <h1 className="page-title mt-3 mb-6">Edit job</h1>
      <EditJobForm job={job} categories={categories} />
    </div>
  )
}
