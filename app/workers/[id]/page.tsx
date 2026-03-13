import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function WorkerProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  const user = await prisma.user.findUnique({
    where: { id: params.id, role: 'WORKER' },
    include: {
      workerProfile: true,
      reviewsReceived: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  })
  if (!user || !user.workerProfile) notFound()

  const profile = user.workerProfile

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/jobs" className="text-earth-500 hover:text-earth-700 text-sm mb-6 inline-flex items-center gap-1">← Back</Link>

        <div className="card mb-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-brand-100 flex items-center justify-center text-3xl font-bold text-brand-600 flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-display text-earth-900">{user.name}</h1>
                {profile.trustedBadge && (
                  <span className="trusted-badge">✓ Trusted Worker</span>
                )}
              </div>
              {profile.area && (
                <div className="text-earth-500 text-sm mb-2">📍 {profile.area}</div>
              )}
              <div className="flex items-center gap-4 text-sm">
                {profile.averageRating > 0 && (
                  <span className="font-semibold text-brand-600">⭐ {profile.averageRating} avg rating</span>
                )}
                <span className="text-earth-500">{profile.jobsCompleted} jobs completed</span>
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-5 pt-5 border-t border-earth-100">
              <h3 className="text-sm font-semibold text-earth-500 uppercase tracking-wide mb-2">About</h3>
              <p className="text-earth-700 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {profile.servicesOffered.length > 0 && (
            <div className="mt-5 pt-5 border-t border-earth-100">
              <h3 className="text-sm font-semibold text-earth-500 uppercase tracking-wide mb-3">Services</h3>
              <div className="flex flex-wrap gap-2">
                {profile.servicesOffered.map(s => (
                  <span key={s} className="badge bg-earth-100 text-earth-700">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {user.reviewsReceived.length > 0 && (
          <div>
            <h2 className="section-title mb-4">Reviews ({user.reviewsReceived.length})</h2>
            <div className="space-y-4">
              {user.reviewsReceived.map(review => (
                <div key={review.id} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-earth-800">{review.customer.name}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-brand-500' : 'text-earth-200'}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-earth-600 text-sm">{review.comment}</p>}
                  <p className="text-xs text-earth-400 mt-2">{formatDate(review.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
