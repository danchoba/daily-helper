'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  paymentId: string
  paymentType: string
  userId: string
}

export function PaymentActions({ paymentId, paymentType }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [showConnectionFields, setShowConnectionFields] = useState(false)

  async function handleAction(action: 'approve' | 'reject') {
    if (action === 'approve' && paymentType === 'CONNECTION_FEE' && !showConnectionFields) {
      setShowConnectionFields(true)
      return
    }
    if (action === 'approve' && paymentType === 'CONNECTION_FEE' && (!jobId || !workerId)) {
      alert('Provide the job ID and worker ID before approving this connection fee.')
      return
    }
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this payment?`)) return

    setLoading(true)
    try {
      await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, jobId: jobId || undefined, workerId: workerId || undefined }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-w-[220px] space-y-3">
      {showConnectionFields && (
        <div className="space-y-2 rounded-2xl border border-earth-200 bg-earth-50 p-3">
          <input className="input text-xs" placeholder="Job ID" value={jobId} onChange={e => setJobId(e.target.value)} />
          <input className="input text-xs" placeholder="Worker ID" value={workerId} onChange={e => setWorkerId(e.target.value)} />
        </div>
      )}
      <div className="flex gap-2 md:flex-col">
        <button onClick={() => handleAction('approve')} disabled={loading} className="btn-primary btn-sm">
          {showConnectionFields ? 'Confirm approve' : 'Approve'}
        </button>
        <button onClick={() => handleAction('reject')} disabled={loading} className="btn-danger btn-sm">
          Reject
        </button>
      </div>
    </div>
  )
}
