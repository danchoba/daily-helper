import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { EditJobForm } from './EditJobForm'

export default async function EditJobPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')
  const [job, categories] = await Promise.all([
    prisma.job.findUnique({ where: { id: params.id, customerId: session.id }, include: { category: true } }),
    prisma.category.findMany()
  ])
  if (!job) notFound()
  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard/customer/jobs" className="text-earth-500 text-sm">← My Jobs</Link>
        <h1 className="page-title mt-2 mb-6">Edit Job</h1>
        <EditJobForm job={job} categories={categories} />
      </div>
    </div>
  )
}
