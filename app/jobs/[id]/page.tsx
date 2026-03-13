import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/Badge'
import { formatBWP, formatDate, timeAgo, urgencyLabel, urgencyColor, jobStatusLabel, statusColor } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ApplyButton } from './ApplyButton'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      customer: { select: { id: true, name: true } },
      applications: {
        where: { workerId: session?.id || 'none' },
        take: 1
      },
      _count: { select: { applications: true } }
    }
  })
  if (!job) notFound()

  const hasApplied = job.applications.length > 0
  const isOwner = session?.id === job.customer.id
  const isWorker = session?.role === 'WORKER'

  const shareText = encodeURIComponent(`Job: ${job.title}\nLocation: ${job.area}\nBudget: ${formatBWP(job.budget)}\nApply: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/jobs/${job.id}`)
  const whatsappUrl = `https://wa.me/?text=${shareText}`

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/jobs" className="text-earth-500 hover:text-earth-700 text-sm mb-6 inline-flex items-center gap-1">
          ← Back to jobs
        </Link>

        <div className="card mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{job.category.icon || '🛠️'}</span>
              <span className="text-earth-500 text-sm">{job.category.name}</span>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              <span className={`badge ${urgencyColor(job.urgency)}`}>{urgencyLabel(job.urgency)}</span>
              <span className={`badge ${statusColor(job.status)}`}>{jobStatusLabel(job.status)}</span>
            </div>
          </div>

          <h1 className="text-2xl font-display text-earth-900 mb-3">{job.title}</h1>
          <p className="text-earth-600 leading-relaxed mb-6 whitespace-pre-line">{job.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-earth-100">
            <div>
              <div className="text-xs text-earth-400 font-medium mb-1">BUDGET</div>
              <div className="font-bold text-earth-900">{formatBWP(job.budget)}</div>
            </div>
            <div>
              <div className="text-xs text-earth-400 font-medium mb-1">LOCATION</div>
              <div className="font-semibold text-earth-900">📍 {job.area}</div>
            </div>
            <div>
              <div className="text-xs text-earth-400 font-medium mb-1">PREFERRED DATE</div>
              <div className="font-semibold text-earth-900 text-sm">{formatDate(job.preferredDate)}</div>
            </div>
            <div>
              <div className="text-xs text-earth-400 font-medium mb-1">APPLICANTS</div>
              <div className="font-bold text-earth-900">{job._count.applications}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-earth-100">
            <div className="text-sm text-earth-500">Posted by <span className="font-medium text-earth-700">{job.customer.name}</span> · {timeAgo(job.createdAt)}</div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-sage-600 hover:text-sage-700 font-medium flex items-center gap-1">
              📲 Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Actions */}
        {isOwner && (
          <div className="card bg-brand-50 border-brand-200">
            <h3 className="font-semibold text-brand-800 mb-3">Your job</h3>
            <div className="flex gap-3 flex-wrap">
              <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-primary btn-sm">
                View Applicants ({job._count.applications})
              </Link>
              <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-outline btn-sm">Edit</Link>
            </div>
          </div>
        )}

        {isWorker && !isOwner && job.status === 'OPEN' && (
          <div className="card">
            <h3 className="font-semibold text-earth-900 mb-3">Apply for this job</h3>
            {hasApplied ? (
              <div className="bg-sage-50 border border-sage-200 text-sage-800 rounded-xl p-3 text-sm">
                ✓ You have already applied for this job.
              </div>
            ) : (
              <ApplyButton jobId={job.id} />
            )}
          </div>
        )}

        {!session && (
          <div className="card text-center">
            <p className="text-earth-600 mb-4">Sign up to apply for this job</p>
            <Link href="/signup?role=worker" className="btn-primary">Sign Up as a Worker</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
