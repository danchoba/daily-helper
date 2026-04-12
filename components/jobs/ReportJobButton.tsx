'use client'
import { useState } from 'react'
import { Flag, X } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function ReportJobButton({ jobId }: { jobId: string }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-400">
        <Flag size={13} />
        Reported
      </span>
    )
  }

  async function submit() {
    if (!reason.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      if (res.ok) {
        setDone(true)
        setOpen(false)
        toast.success('Job reported. We will review it shortly.')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to submit report.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-earth-400 transition-colors hover:text-red-500"
      >
        <Flag size={13} />
        Report listing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-earth-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-earth-900">Report this listing</h2>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-earth-400 hover:bg-earth-100">
                <X size={16} />
              </button>
            </div>
            <p className="mb-4 text-sm text-earth-500">
              Describe why this listing is inappropriate, misleading, or violates platform rules.
            </p>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="e.g. This job asks for payment upfront, which seems fraudulent."
              value={reason}
              onChange={e => setReason(e.target.value)}
              maxLength={500}
              aria-label="Report reason"
            />
            <div className="mt-1 flex justify-end">
              <span className="text-xs text-earth-400">{reason.length}/500</span>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={submit}
                disabled={loading || !reason.trim()}
                className="btn-primary flex-1"
              >
                {loading ? 'Submitting…' : 'Submit report'}
              </button>
              <button onClick={() => setOpen(false)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
