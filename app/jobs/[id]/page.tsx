import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, MessageSquareShare, Users } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { formatBWP, formatDate, timeAgo, urgencyLabel, urgencyColor, jobStatusLabel, statusColor } from '@/lib/utils'
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
        take: 1,
      },
      _count: { select: { applications: true } },
    },
  })

  if (!job) notFound()

  const hasApplied = job.applications.length > 0
  const isOwner = session?.id === job.customer.id
  const isWorker = session?.role === 'WORKER'
  const shareText = encodeURIComponent(
    `Job: ${job.title}\nLocation: ${job.area}\nBudget: ${formatBWP(job.budget)}\nApply: ${(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')}/jobs/${job.id}`
  )
  const whatsappUrl = `https://wa.me/?text=${shareText}`

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="page-shell max-w-4xl">
        <Breadcrumbs items={[
          { label: 'Marketplace', href: '/jobs' },
          { label: job.title },
        ]} />

        <div className="card">
          <div className="mb-5 flex flex-col gap-4 border-b border-earth-200 pb-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-earth-500">{job.category.name}</div>
              <h1 className="text-3xl font-extrabold tracking-tight text-earth-950">{job.title}</h1>
              <p className="mt-3 text-sm leading-7 text-earth-600">
                Posted by <span className="font-semibold text-earth-800">{job.customer.name}</span> {timeAgo(job.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={urgencyColor(job.urgency)}>{urgencyLabel(job.urgency)}</Badge>
              <Badge className={statusColor(job.status)}>{jobStatusLabel(job.status)}</Badge>
            </div>
          </div>

          <div className="grid gap-4 border-b border-earth-200 pb-5 md:grid-cols-4">
            <div className="muted-panel p-4">
              <div className="kicker mb-1">Budget</div>
              <div className="font-semibold text-earth-900">{formatBWP(job.budget)}</div>
            </div>
            <div className="muted-panel p-4">
              <div className="kicker mb-1">Location</div>
              <div className="inline-flex items-center gap-1.5 font-semibold text-earth-900">
                <MapPin size={15} aria-hidden="true" />
                {job.area}
              </div>
            </div>
            <div className="muted-panel p-4">
              <div className="kicker mb-1">Preferred date</div>
              <div className="font-semibold text-earth-900">{formatDate(job.preferredDate)}</div>
            </div>
            <div className="muted-panel p-4">
              <div className="kicker mb-1">Applicants</div>
              <div className="inline-flex items-center gap-1.5 font-semibold text-earth-900">
                <Users size={15} />
                {job._count.applications}
              </div>
            </div>
          </div>

          <div className="py-5">
            <div className="kicker mb-2">Job description</div>
            <p className="whitespace-pre-line text-sm leading-7 text-earth-700">{job.description}</p>
          </div>

          <div className="flex flex-col gap-3 border-t border-earth-200 pt-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-earth-500">
              Share this listing with a worker who may be a good fit.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              aria-label="Share this job listing on WhatsApp (opens in new tab)"
            >
              <MessageSquareShare size={16} aria-hidden="true" />
              Share on WhatsApp
            </a>
          </div>
        </div>

        {isOwner && (
          <div className="mt-4 rounded-2xl border border-earth-200 bg-earth-50 p-5">
            <h2 className="text-lg font-bold tracking-tight text-earth-900">Manage this job</h2>
            <p className="mt-1 text-sm text-earth-600">Review applicants, edit details, and monitor hiring progress from your dashboard.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-primary">
                View applicants ({job._count.applications})
              </Link>
              <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-outline">
                Edit job
              </Link>
            </div>
          </div>
        )}

        {isWorker && !isOwner && job.status === 'OPEN' && (
          <div className="card mt-4">
            <h2 className="text-lg font-bold tracking-tight text-earth-900">Apply for this job</h2>
            <p className="mt-1 text-sm text-earth-600">
              Introduce yourself briefly and explain why you are a strong fit for the task.
            </p>
            <div className="mt-4">
              {hasApplied ? (
                <div className="rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">
                  Your application has already been submitted. The customer can review it from their hiring queue.
                </div>
              ) : (
                <ApplyButton jobId={job.id} />
              )}
            </div>
          </div>
        )}

        {!session && (
          <div className="card mt-4 text-center">
            <h2 className="text-lg font-bold tracking-tight text-earth-900">Create an account to apply</h2>
            <p className="mt-2 text-sm text-earth-600">Workers need an account before they can submit applications or build a trusted profile.</p>
            <Link href="/signup?role=worker" className="btn-primary mt-4">
              Sign up as a worker
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
