'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AdminJobActions({ jobId, currentStatus }: { jobId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function setStatus(status: string) {
    setLoading(true)
    try {
      await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      {currentStatus === 'OPEN' && (
        <button onClick={() => setStatus('CLOSED')} disabled={loading} className="btn-outline btn-sm text-xs">Close</button>
      )}
      {currentStatus !== 'CANCELLED' && (
        <button onClick={() => setStatus('CANCELLED')} disabled={loading} className="btn-danger btn-sm text-xs">Cancel</button>
      )}
    </div>
  )
}
