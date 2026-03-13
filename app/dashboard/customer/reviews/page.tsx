import Link from 'next/link'
import { Star } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function CustomerReviewsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'CUSTOMER') redirect('/login')

  const reviews = await prisma.review.findMany({
    where: { customerId: session.id },
    include: { worker: { select: { id: true, name: true } }, job: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl">
        <Link href="/dashboard/customer" className="subtle-link inline-flex items-center gap-2">Back to dashboard</Link>
        <h1 className="page-title mt-3 mb-6">My reviews</h1>

        {reviews.length === 0 ? (
          <EmptyState title="No reviews submitted yet" description="Complete a job to leave a review for the worker you hired." />
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="card">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Link href={`/workers/${review.workerId}`} className="text-base font-bold tracking-tight text-earth-950 hover:text-earth-700">
                    {review.worker.name}
                  </Link>
                  <div className="inline-flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(value => (
                      <Star key={value} size={14} fill={value <= review.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-earth-500">For job: {review.job.title}</p>
                {review.comment && <p className="text-sm leading-6 text-earth-700">{review.comment}</p>}
                <p className="mt-3 text-xs text-earth-400">{formatDate(review.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
