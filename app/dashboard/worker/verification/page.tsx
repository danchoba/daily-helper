import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BadgeCheck } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { VerificationForm } from './VerificationForm'
import { formatDate } from '@/lib/utils'

export default async function WorkerVerificationPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'WORKER') redirect('/login')

  const [profile, verRequest] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId: session.id } }),
    prisma.verificationRequest.findFirst({
      where: { workerId: session.id },
      orderBy: { submittedAt: 'desc' },
      include: { payment: true },
    }),
  ])

  return (
    <div className="max-w-3xl">
        <Link href="/dashboard/worker" className="subtle-link inline-flex items-center gap-2">Back to dashboard</Link>
        <h1 className="page-title mt-3 mb-2">Verification</h1>
        <p className="mb-6 text-sm leading-6 text-earth-500">Build trust with customers by completing the trusted worker verification flow.</p>

        {profile?.trustedBadge ? (
          <div className="card text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100 text-sage-800">
              <BadgeCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-earth-950">You are verified</h2>
            <p className="mt-2 text-sm leading-6 text-earth-600">
              Your trusted badge is active and will appear on your profile and job applications.
            </p>
            <div className="mt-4 inline-flex rounded-full border border-sage-200 bg-sage-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-sage-800">
              Trusted worker
            </div>
          </div>
        ) : verRequest && verRequest.status === 'PENDING' ? (
          <div className="card">
            <div className="kicker mb-2">Current request</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Verification under review</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-earth-200 py-2">
                <span className="text-earth-500">Status</span>
                <span className="rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-yellow-800">
                  Pending review
                </span>
              </div>
              <div className="flex justify-between border-b border-earth-200 py-2">
                <span className="text-earth-500">Submitted</span>
                <span className="font-medium text-earth-900">{formatDate(verRequest.submittedAt)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-earth-500">Payment reference</span>
                <span className="font-mono text-xs text-earth-800">{verRequest.paymentReference}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-earth-500">An admin reviews verification requests manually. This usually takes one to two business days.</p>
          </div>
        ) : verRequest && verRequest.status === 'REJECTED' ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="font-semibold text-red-700">Previous verification request rejected</p>
              <p className="mt-1 text-sm text-red-600">Review the payment details and submit a new request when ready.</p>
            </div>
            <VerificationForm />
          </div>
        ) : (
          <VerificationForm />
        )}
    </div>
  )
}
