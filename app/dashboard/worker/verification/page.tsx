import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
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
      include: { payment: true }
    })
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard/worker" className="text-earth-500 text-sm">← Dashboard</Link>
        <h1 className="page-title mt-2 mb-2">Trusted Badge Verification</h1>
        <p className="text-earth-500 mb-6">Get verified and build trust with customers.</p>

        {profile?.trustedBadge ? (
          <div className="card text-center">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-xl font-display text-earth-900 mb-2">You are a Trusted Worker!</h2>
            <p className="text-earth-600">Your identity has been verified. The Trusted badge appears on your profile and job applications.</p>
            <span className="trusted-badge text-base px-4 py-2 mt-4 inline-block">✓ Trusted Worker</span>
          </div>
        ) : verRequest && verRequest.status === 'PENDING' ? (
          <div className="card">
            <h3 className="font-semibold text-earth-900 mb-4">Verification under review</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-earth-100">
                <span className="text-earth-500">Status</span>
                <span className="badge bg-yellow-100 text-yellow-800">Pending Review</span>
              </div>
              <div className="flex justify-between py-2 border-b border-earth-100">
                <span className="text-earth-500">Submitted</span>
                <span>{formatDate(verRequest.submittedAt)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-earth-500">Payment reference</span>
                <span className="font-mono text-xs">{verRequest.paymentReference}</span>
              </div>
            </div>
            <p className="text-earth-500 text-sm mt-4">An admin will review your request within 1-2 business days.</p>
          </div>
        ) : verRequest && verRequest.status === 'REJECTED' ? (
          <div className="space-y-4">
            <div className="card bg-red-50 border-red-200">
              <p className="text-red-700 font-medium mb-1">Verification rejected</p>
              <p className="text-red-600 text-sm">Your previous request was not approved. You can submit a new request.</p>
            </div>
            <VerificationForm />
          </div>
        ) : (
          <VerificationForm />
        )}
      </div>
    </div>
  )
}
