import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { VerificationActions } from './VerificationActions'

export default async function AdminVerificationsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const requests = await prisma.verificationRequest.findMany({
    include: {
      worker: { select: { id: true, name: true, email: true } },
      payment: true
    },
    orderBy: { submittedAt: 'desc' }
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard/admin" className="text-earth-500 text-sm">← Admin</Link>
        <h1 className="page-title mt-2 mb-6">Verification Requests ({requests.length})</h1>
        {requests.length === 0 ? (
          <div className="card text-center py-12 text-earth-500">No verification requests yet.</div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Link href={`/workers/${req.workerId}`} className="font-semibold text-earth-900 hover:text-brand-600">{req.worker.name}</Link>
                      <span className={`badge ${req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : req.status === 'APPROVED' ? 'bg-sage-100 text-sage-800' : 'bg-red-100 text-red-700'}`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-sm text-earth-500 space-y-1">
                      <div>Email: {req.worker.email}</div>
                      <div>Payment reference: <span className="font-mono text-xs bg-earth-100 px-2 py-0.5 rounded">{req.paymentReference}</span></div>
                      <div>Payment status: {req.payment?.status || 'No payment record'}</div>
                      <div>Submitted: {formatDate(req.submittedAt)}</div>
                      {req.reviewedAt && <div>Reviewed: {formatDate(req.reviewedAt)}</div>}
                    </div>
                  </div>
                  {req.status === 'PENDING' && (
                    <VerificationActions requestId={req.id} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
