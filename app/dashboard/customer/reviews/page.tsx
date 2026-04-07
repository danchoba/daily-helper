import Link from 'next/link'
import { MessageSquareText, Star } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { EmptyState } from '@/components/ui/EmptyState'

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export default async function CustomerReviewsPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'CUSTOMER') redirect('/dashboard/' + session.role.toLowerCase())

  const [reviews, pendingReviewJobs] = await Promise.all([
    prisma.review.findMany({
      where: { customerId: session.id },
      orderBy: { createdAt: 'desc' },
      include: {
        job: { select: { id: true, title: true } },
        worker: { select: { name: true } },
      },
    }),
    prisma.job.findMany({
      where: {
        customerId: session.id,
        status: 'COMPLETED',
        review: null,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        applications: {
          where: { status: 'SELECTED' },
          select: { worker: { select: { name: true } } },
          take: 1,
        },
      },
    }),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Customer dashboard</p>
        <h1 className="text-2xl font-black tracking-tight text-earth-950 md:text-3xl">Reviews</h1>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-earth-500">
          Rate workers after completed jobs to help build trust on the platform.
        </p>
      </div>

      {/* Pending reviews */}
      {pendingReviewJobs.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">Awaiting your review</p>
          <div className="space-y-3">
            {pendingReviewJobs.map(job => {
              const workerName = job.applications[0]?.worker.name
              return (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
                >
                  <div>
                    <p className="text-sm font-bold text-earth-900">{job.title}</p>
                    {workerName && (
                      <p className="mt-0.5 text-xs text-earth-500">Worker: {workerName}</p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/customer/jobs/${job.id}/applicants`}
                    className="shrink-0 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-amber-600"
                  >
                    Leave review
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Submitted reviews */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">
          Submitted {reviews.length > 0 && `· ${reviews.length}`}
        </p>

        {reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText size={22} />}
            title="No reviews yet"
            description="Reviews appear here after you complete a job and rate the worker."
          />
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div
                key={review.id}
                className="rounded-2xl border border-earth-200/80 bg-white p-5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/customer/jobs/${review.job.id}`}
                      className="truncate text-sm font-bold text-earth-900 hover:text-brand-600"
                    >
                      {review.job.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-earth-500">Worker: {review.worker.name}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <Star
                        key={v}
                        size={14}
                        className={v <= review.rating ? 'text-amber-400' : 'text-earth-200'}
                        fill={v <= review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold text-earth-600">{review.rating}/5</span>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm leading-relaxed text-earth-600">{review.comment}</p>
                )}
                <p className="mt-3 text-xs text-earth-400">{timeAgo(new Date(review.createdAt))}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
