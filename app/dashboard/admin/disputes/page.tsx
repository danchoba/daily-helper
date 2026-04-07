import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/ui/EmptyState'
import { DisputeActions } from './DisputeActions'
import { AlertTriangle } from 'lucide-react'

export default async function AdminDisputesPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const disputes = await prisma.dispute.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      job: { select: { id: true, title: true, status: true } },
      raisedBy: { select: { name: true, role: true } },
      resolvedBy: { select: { name: true } },
    },
  })

  const open = disputes.filter(d => d.status === 'OPEN')
  const closed = disputes.filter(d => d.status !== 'OPEN')

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <Link href="/dashboard/admin" className="subtle-link inline-flex items-center gap-2">Back to admin</Link>
        <h1 className="page-title mt-3">Disputes ({disputes.length})</h1>
      </div>

      {disputes.length === 0 ? (
        <EmptyState
          icon={<AlertTriangle size={22} />}
          title="No disputes"
          description="Disputes raised by customers or workers will appear here for review."
        />
      ) : (
        <>
          {open.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">Open · {open.length}</p>
              <div className="space-y-4">
                {open.map(dispute => (
                  <div key={dispute.id} className="card border-l-4 border-l-red-400">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/dashboard/admin/jobs`}
                          className="text-base font-bold text-earth-950 hover:text-brand-700"
                        >
                          {dispute.job.title}
                        </Link>
                        <p className="mt-1 text-sm text-earth-500">
                          Raised by <strong>{dispute.raisedBy.name}</strong> ({dispute.raisedBy.role.toLowerCase()}) · {formatDate(dispute.createdAt)}
                        </p>
                      </div>
                      <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-700">
                        Open
                      </span>
                    </div>
                    <div className="mt-3 rounded-xl border border-earth-100 bg-earth-50 p-3 text-sm leading-relaxed text-earth-700">
                      {dispute.reason}
                    </div>
                    <DisputeActions disputeId={dispute.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {closed.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">Resolved / Closed · {closed.length}</p>
              <div className="space-y-4">
                {closed.map(dispute => (
                  <div key={dispute.id} className="card opacity-75">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-earth-950">{dispute.job.title}</p>
                        <p className="mt-1 text-sm text-earth-500">
                          Raised by <strong>{dispute.raisedBy.name}</strong> · {formatDate(dispute.createdAt)}
                        </p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        dispute.status === 'RESOLVED'
                          ? 'border-success-200 bg-success-50 text-success-800'
                          : 'border-earth-200 bg-earth-50 text-earth-600'
                      }`}>
                        {dispute.status}
                      </span>
                    </div>
                    {dispute.resolution && (
                      <p className="mt-3 text-sm text-earth-600">
                        <span className="font-semibold">Resolution:</span> {dispute.resolution}
                      </p>
                    )}
                    {dispute.resolvedBy && (
                      <p className="mt-1 text-xs text-earth-400">
                        Resolved by {dispute.resolvedBy.name} · {formatDate(dispute.resolvedAt)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
