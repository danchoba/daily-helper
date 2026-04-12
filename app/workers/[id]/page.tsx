import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, MessageSquareShare, ShieldCheck, Star } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export default async function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession()
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id, role: 'WORKER' },
    include: {
      workerProfile: true,
      reviewsReceived: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (!user || !user.workerProfile) notFound()

  const profile = user.workerProfile
  const shareText = encodeURIComponent(
    `Check out ${user.name} on Daily Helper — a local worker available for hire.\n${APP_URL}/workers/${id}`
  )
  const whatsappUrl = `https://wa.me/?text=${shareText}`

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="page-shell max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/jobs" className="subtle-link inline-flex items-center gap-2">
            Back to jobs
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            aria-label="Share this worker's profile on WhatsApp"
          >
            <MessageSquareShare size={15} aria-hidden="true" />
            Share profile
          </a>
        </div>

        <div className="card mt-4">
          <div className="flex flex-col gap-5 border-b border-earth-200 pb-5 md:flex-row">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-earth-900 text-3xl font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-earth-950">{user.name}</h1>
                {profile.trustedBadge && (
                  <Badge className="border-sage-200 bg-sage-100 text-sage-800">
                    <ShieldCheck size={12} />
                    Trusted worker
                  </Badge>
                )}
              </div>
              {profile.area && (
                <div className="mb-3 inline-flex items-center gap-1.5 text-sm text-earth-500">
                  <MapPin size={15} />
                  {profile.area}
                </div>
              )}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="muted-panel px-4 py-3">
                  <div className="kicker mb-1">Rating</div>
                  <div className="inline-flex items-center gap-1.5 font-semibold text-earth-900">
                    <Star size={14} className="text-amber-500" />
                    {profile.averageRating > 0 ? profile.averageRating.toFixed(1) : 'No rating yet'}
                  </div>
                </div>
                <div className="muted-panel px-4 py-3">
                  <div className="kicker mb-1">Completed jobs</div>
                  <div className="font-semibold text-earth-900">{profile.jobsCompleted}</div>
                </div>
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="border-b border-earth-200 py-5">
              <div className="kicker mb-2">About</div>
              <p className="text-sm leading-7 text-earth-700">{profile.bio}</p>
            </div>
          )}

          {profile.servicesOffered.length > 0 && (
            <div className="pt-5">
              <div className="kicker mb-3">Services offered</div>
              <div className="flex flex-wrap gap-2">
                {profile.servicesOffered.map(service => (
                  <span key={service} className="rounded-full border border-earth-200 bg-earth-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-earth-700">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {user.reviewsReceived.length > 0 && (
          <div className="mt-6">
            <div className="mb-4">
              <div className="kicker mb-2">Reviews</div>
              <h2 className="section-title">Customer feedback</h2>
            </div>
            <div className="space-y-4">
              {user.reviewsReceived.map(review => (
                <div key={review.id} className="card">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="font-semibold text-earth-900">{review.customer.name}</span>
                    <div className="inline-flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={14} fill={index < review.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  {review.comment && <p className="text-sm leading-6 text-earth-700">{review.comment}</p>}
                  <p className="mt-3 text-xs text-earth-400">{formatDate(review.createdAt)}</p>
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
