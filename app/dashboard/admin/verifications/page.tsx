import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { VerificationActions } from './VerificationActions'

export default async function AdminVerificationsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const requests = await prisma.verificationRequest.findMany({
    include: {
      worker: { select: { id: true, name: true, email: true } },
      payment: true,
    },
    orderBy: { submittedAt: 'desc' },
  })

  return (
    <div className="max-w-5xl">
      <Link href="/dashboard/admin" className="subtle-link inline-flex items-center gap-2">Back to admin</Link>
      <h1 className="page-title mt-3 mb-6">Verification requests ({requests.length})</h1>

      {requests.length === 0 ? (
        <div className="card text-center py-12 text-earth-500">No verification requests yet.</div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="card">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Link href={`/workers/${request.workerId}`} className="text-base font-bold tracking-tight text-earth-950 hover:text-brand-700">
                      {request.worker.name}
                    </Link>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                        request.status === 'PENDING'
                          ? 'border border-yellow-200 bg-yellow-100 text-yellow-800'
                          : request.status === 'APPROVED'
                            ? 'border border-success-200 bg-success-100 text-success-800'
                            : 'border border-red-200 bg-red-50 text-red-700'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm text-earth-500 md:grid-cols-2">
                    <div>Email: <span className="font-medium text-earth-800">{request.worker.email}</span></div>
                    <div>Payment status: <span className="font-medium text-earth-800">{request.payment?.status || 'No payment record'}</span></div>
                    <div>
                      Reference: <span className="rounded bg-earth-100 px-2 py-1 font-mono text-xs text-earth-800">{request.paymentReference}</span>
                    </div>
                    <div>Submitted: <span className="font-medium text-earth-800">{formatDate(request.submittedAt)}</span></div>
                    {request.reviewedAt && <div>Reviewed: <span className="font-medium text-earth-800">{formatDate(request.reviewedAt)}</span></div>}
                  </div>
                </div>
                {request.status === 'PENDING' && <VerificationActions requestId={request.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
