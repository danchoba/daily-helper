'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function RaiseDisputeButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!reason.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Dispute raised. An admin will review it shortly.')
        setOpen(false)
        setReason('')
        router.refresh()
      } else {
        toast.error(data.error ?? 'Failed to raise dispute.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        <span className="flex items-center gap-2">
          <AlertTriangle size={14} />
          Raise dispute
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-earth-950">Raise a dispute</h2>
              <button onClick={() => setOpen(false)} className="text-earth-400 hover:text-earth-600">
                <X size={18} />
              </button>
            </div>
            <p className="mb-4 text-sm text-earth-500">
              Describe the issue. An admin will review the dispute and follow up with both parties.
            </p>
            <textarea
              className="input w-full resize-none"
              rows={4}
              placeholder="Explain what went wrong…"
              value={reason}
              onChange={e => setReason(e.target.value)}
              maxLength={1000}
            />
            <div className="mb-4 text-right text-xs text-earth-400">{reason.length}/1000</div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-earth-500 hover:text-earth-700"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading || !reason.trim()}
                className="btn-primary"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : 'Submit dispute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
