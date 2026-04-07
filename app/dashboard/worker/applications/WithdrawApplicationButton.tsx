'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function WithdrawApplicationButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function withdraw() {
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Application withdrawn.')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error ?? 'Failed to withdraw.')
      }
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-earth-500">Are you sure?</span>
        <button
          onClick={withdraw}
          disabled={loading}
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : 'Yes, withdraw'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-earth-500 hover:text-earth-700"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg border border-earth-200 px-3 py-1.5 text-xs font-semibold text-earth-500 transition-colors hover:border-red-200 hover:text-red-600"
    >
      Withdraw
    </button>
  )
}
