'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function DisputeActions({ disputeId }: { disputeId: string }) {
  const router = useRouter()
  const toast = useToast()
  const [resolution, setResolution] = useState('')
  const [loading, setLoading] = useState(false)

  async function resolve(status: 'RESOLVED' | 'CLOSED') {
    if (!resolution.trim()) {
      toast.error('Please enter a resolution note.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution, status }),
      })
      if (res.ok) {
        toast.success('Dispute updated.')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Failed to update dispute.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-earth-100 pt-4">
      <textarea
        className="input w-full resize-none"
        rows={2}
        placeholder="Resolution note (required)…"
        value={resolution}
        onChange={e => setResolution(e.target.value)}
        maxLength={500}
      />
      <div className="flex gap-2">
        <button
          onClick={() => resolve('RESOLVED')}
          disabled={loading}
          className="rounded-xl border border-success-200 bg-success-50 px-4 py-2 text-xs font-bold text-success-800 transition-colors hover:bg-success-100 disabled:opacity-50"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : 'Mark resolved'}
        </button>
        <button
          onClick={() => resolve('CLOSED')}
          disabled={loading}
          className="rounded-xl border border-earth-200 px-4 py-2 text-xs font-bold text-earth-600 transition-colors hover:bg-earth-50 disabled:opacity-50"
        >
          Close without resolution
        </button>
      </div>
    </div>
  )
}
