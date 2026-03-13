'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { paymentId: string; paymentType: string; userId: string }

export function PaymentActions({ paymentId, paymentType, userId }: Props) {
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
      alert('Please provide Job ID and Worker ID for connection fee approval')
      return
    }
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this payment?`)) return
    setLoading(true)
    try {
      await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, jobId: jobId || undefined, workerId: workerId || undefined })
      })
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col gap-2 flex-shrink-0 min-w-[160px]">
      {showConnectionFields && (
        <div className="space-y-2">
          <input className="input text-xs py-2" placeholder="Job ID" value={jobId} onChange={e => setJobId(e.target.value)} />
          <input className="input text-xs py-2" placeholder="Worker ID" value={workerId} onChange={e => setWorkerId(e.target.value)} />
        </div>
      )}
      <button onClick={() => handleAction('approve')} disabled={loading} className="btn-primary btn-sm text-xs">
        {showConnectionFields ? 'Confirm Approve' : 'Approve'}
      </button>
      <button onClick={() => handleAction('reject')} disabled={loading} className="btn-danger btn-sm text-xs">Reject</button>
    </div>
  )
}
