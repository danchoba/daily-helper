import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate, formatBWP } from '@/lib/utils'
import { PaymentActions } from './PaymentActions'

export default async function AdminPaymentsPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const payments = await prisma.payment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  const pendingPayments = payments.filter(payment => payment.status === 'PENDING').length
  const connectionFees = payments.filter(payment => payment.type === 'CONNECTION_FEE').length

  return (
    <div>
        <Link href="/dashboard/admin" className="subtle-link inline-flex items-center gap-2">Back to admin</Link>
        <div className="mb-6 mt-3">
          <div className="kicker mb-2">Payments</div>
          <h1 className="page-title">Payment records</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-earth-500">
            Manual payment review affects verification approvals and customer contact unlocks. Check references carefully before approving.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="muted-panel p-4">
            <div className="kicker mb-1">Pending review</div>
            <div className="text-2xl font-extrabold tracking-tight text-earth-950">{pendingPayments}</div>
          </div>
          <div className="muted-panel p-4">
            <div className="kicker mb-1">Connection fees</div>
            <div className="text-2xl font-extrabold tracking-tight text-earth-950">{connectionFees}</div>
          </div>
          <div className="muted-panel p-4">
            <div className="kicker mb-1">Total records</div>
            <div className="text-2xl font-extrabold tracking-tight text-earth-950">{payments.length}</div>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="surface-card p-10 text-center text-sm text-earth-500">No payment records yet.</div>
        ) : (
          <div className="space-y-4">
            {payments.map(payment => (
              <div key={payment.id} className="card">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold tracking-tight text-earth-950">{payment.user.name}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                        payment.type === 'CONNECTION_FEE'
                          ? 'border border-blue-200 bg-blue-50 text-blue-800'
                          : 'border border-earth-200 bg-earth-50 text-earth-700'
                      }`}>
                        {payment.type === 'CONNECTION_FEE' ? 'Connection fee' : 'Verification fee'}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                        payment.status === 'PENDING'
                          ? 'border border-yellow-200 bg-yellow-100 text-yellow-800'
                          : payment.status === 'APPROVED'
                            ? 'border border-sage-200 bg-sage-100 text-sage-800'
                            : 'border border-red-200 bg-red-50 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="grid gap-2 text-sm text-earth-600 md:grid-cols-2">
                      <div>Amount: <strong className="text-earth-900">{formatBWP(payment.amount)} {payment.currency}</strong></div>
                      <div>Email: {payment.user.email}</div>
                      <div>
                        Reference: <span className="rounded bg-earth-100 px-2 py-1 font-mono text-xs text-earth-800">{payment.reference}</span>
                      </div>
                      <div>Submitted: {formatDate(payment.createdAt)}</div>
                    </div>
                  </div>
                  {payment.status === 'PENDING' && (
                    <div className="md:min-w-[220px]">
                      <PaymentActions paymentId={payment.id} paymentType={payment.type} userId={payment.userId} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
