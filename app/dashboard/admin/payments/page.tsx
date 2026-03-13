import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { formatDate, formatBWP } from '@/lib/utils'
import { PaymentActions } from './PaymentActions'

export default async function AdminPaymentsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' }
  })

  // For connection fee payments, we need job info
  // Get pending connection fee payments to show job context
  const pendingConnectionFees = await prisma.payment.findMany({
    where: { type: 'CONNECTION_FEE', status: 'PENDING' },
    select: { id: true }
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard/admin" className="text-earth-500 text-sm">← Admin</Link>
        <h1 className="page-title mt-2 mb-2">Payment Records ({payments.length})</h1>
        <p className="text-earth-500 mb-6 text-sm">⚠️ Manual payment flow — verify each reference before approving.</p>
        {payments.length === 0 ? (
          <div className="card text-center py-12 text-earth-500">No payment records yet.</div>
        ) : (
          <div className="space-y-3">
            {payments.map(payment => (
              <div key={payment.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-earth-900">{payment.user.name}</span>
                      <span className={`badge ${payment.type === 'CONNECTION_FEE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {payment.type === 'CONNECTION_FEE' ? 'Connection Fee' : 'Verification Fee'}
                      </span>
                      <span className={`badge ${payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : payment.status === 'APPROVED' ? 'bg-sage-100 text-sage-800' : 'bg-red-100 text-red-700'}`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="text-sm text-earth-500 space-y-0.5">
                      <div>Amount: <strong className="text-earth-800">{formatBWP(payment.amount)} {payment.currency}</strong></div>
                      <div>Reference: <span className="font-mono text-xs bg-earth-100 px-2 py-0.5 rounded">{payment.reference}</span></div>
                      <div>Email: {payment.user.email}</div>
                      <div>Submitted: {formatDate(payment.createdAt)}</div>
                    </div>
                  </div>
                  {payment.status === 'PENDING' && (
                    <PaymentActions paymentId={payment.id} paymentType={payment.type} userId={payment.userId} />
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
