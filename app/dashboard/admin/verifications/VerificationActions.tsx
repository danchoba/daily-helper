'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function VerificationActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleAction(action: 'approve' | 'reject') {
    if (!confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this verification request?`)) return
    setLoading(true)
    try {
      await fetch(`/api/admin/verifications/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 md:flex-col">
      <button onClick={() => handleAction('approve')} disabled={loading} className="btn-primary btn-sm">
        Approve
      </button>
      <button onClick={() => handleAction('reject')} disabled={loading} className="btn-danger btn-sm">
        Reject
      </button>
    </div>
  )
}
