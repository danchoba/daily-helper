import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function CustomerReviewsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const reviews = await prisma.review.findMany({
    where: { customerId: session.id },
    include: { worker: { select: { id: true, name: true } }, job: { select: { title: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard/customer" className="text-earth-500 text-sm">← Dashboard</Link>
        <h1 className="page-title mt-2 mb-6">My Reviews</h1>
        {reviews.length === 0 ? (
          <EmptyState icon="⭐" title="No reviews yet" description="Complete a job to leave a review for the worker." />
        ) : (
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/workers/${r.workerId}`} className="font-semibold text-earth-900 hover:text-brand-600">{r.worker.name}</Link>
                  <div className="flex">{[1,2,3,4,5].map(i => <span key={i} className={i <= r.rating ? 'text-brand-500' : 'text-earth-200'}>★</span>)}</div>
                </div>
                <p className="text-earth-500 text-xs mb-2">For: {r.job.title}</p>
                {r.comment && <p className="text-earth-700 text-sm">{r.comment}</p>}
                <p className="text-xs text-earth-400 mt-2">{formatDate(r.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
