import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Briefcase, ShieldCheck, ArrowLeft, Calendar } from 'lucide-react'
import prisma from '@/lib/db'
import { TrustedBadge, VerificationBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

async function getWorker(id: string) {
  return prisma.workerProfile.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, createdAt: true } } },
  })
}

async function getReviews(workerId: string) {
  const wp = await prisma.workerProfile.findUnique({ where: { id: workerId } })
  if (!wp) return []
  return prisma.review.findMany({
    where: { workerId: wp.userId },
    include: { customer: { select: { name: true } }, job: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
}

export default async function WorkerProfilePage({ params }: { params: { id: string } }) {
  const [worker, reviews] = await Promise.all([getWorker(params.id), getReviews(params.id)])
  if (!worker) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/jobs" className="flex items-center gap-1.5 text-earth-500 hover:text-brand-600 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} />Back
      </Link>

      <div className="card p-6 mb-4">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center flex-shrink-0">
            <span className="font-display font-bold text-brand-600 text-2xl">{worker.user.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display text-xl font-bold text-earth-900">{worker.user.name}</h1>
              {worker.trustedBadge && <TrustedBadge />}
            </div>
            {worker.area && (
              <p className="text-earth-500 text-sm flex items-center gap-1 mb-2"><MapPin size={13} />{worker.area}</p>
            )}
            <div className="flex gap-4 text-sm">
              {worker.averageRating > 0 && (
                <span className="flex items-center gap-1 font-semibold text-earth-800">
                  <Star size={14} className="text-amber-500 fill-amber-500" />{worker.averageRating.toFixed(1)} rating
                </span>
              )}
              <span className="flex items-center gap-1 text-earth-500">
                <Briefcase size={14} />{worker.jobsCompleted} jobs done
              </span>
            </div>
          </div>
        </div>

        {worker.bio && (
          <div className="mb-5">
            <h2 className="font-semibold text-earth-800 mb-2 text-sm">About</h2>
            <p className="text-earth-600 text-sm leading-relaxed">{worker.bio}</p>
          </div>
        )}

        {worker.servicesOffered.length > 0 && (
          <div className="mb-5">
            <h2 className="font-semibold text-earth-800 mb-2 text-sm">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {worker.servicesOffered.map(s => (
                <span key={s} className="bg-earth-100 text-earth-700 text-sm px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-earth-400 pt-4 border-t border-earth-100">
          <VerificationBadge status={worker.verificationStatus} />
          <span className="flex items-center gap-1"><Calendar size={12} />Member since {formatDate(worker.user.createdAt)}</span>
        </div>
      </div>

      {reviews.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-earth-900 mb-4">Reviews ({reviews.length})</h2>
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} size={14} className={i <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-earth-200'} />
                    ))}
                  </div>
                  <span className="text-earth-500 text-xs">{review.customer.name} · {review.job.title}</span>
                </div>
                {review.comment && <p className="text-earth-600 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 card p-5 text-center">
        <p className="text-earth-600 text-sm mb-3">Want to hire {worker.user.name}?</p>
        <Link href="/signup" className="btn-primary inline-flex">Post a Job</Link>
      </div>
    </div>
  )
}
