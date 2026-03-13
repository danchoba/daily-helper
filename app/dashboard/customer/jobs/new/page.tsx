import { getServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { NewJobForm } from './NewJobForm'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function NewJobPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard/customer/jobs" className="text-earth-500 text-sm hover:text-earth-700">← My Jobs</Link>
        <h1 className="page-title mt-2 mb-6">Post a New Job</h1>
        <NewJobForm categories={categories} />
      </div>
    </div>
  )
}
