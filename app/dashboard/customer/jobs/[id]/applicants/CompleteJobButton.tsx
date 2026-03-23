'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Star } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export function CompleteJobButton({ jobId, workerId }: { jobId: string; workerId: string }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [done, setDone] = useState(false)

  async function completeJob() {
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      })
      if (res.ok) {
        setShowReview(true)
        toast.success('Job marked as completed!')
      } else {
        toast.error('Failed to complete job.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function submitReview() {
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, rating, comment }),
      })
      if (res.ok) {
        setDone(true)
        toast.success('Review submitted. Thank you!')
        router.refresh()
      } else {
        toast.error('Failed to submit review.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl border border-success-200 bg-success-50 px-4 py-2.5 text-sm font-semibold text-success-800">
        <Star size={15} fill="currentColor" aria-hidden="true" />
        Review submitted
      </div>
    )
  }

  if (showReview) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold text-earth-900">Leave a review for the worker</p>

        {/* Star rating */}
        <div className="flex gap-1" role="group" aria-label="Rating">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${value} star${value !== 1 ? 's' : ''}`}
              aria-pressed={rating === value}
              className="rounded-lg p-1 transition-transform hover:scale-110"
            >
              <Star
                size={26}
                className={value <= (hoverRating || rating) ? 'text-amber-400' : 'text-earth-200'}
                fill={value <= (hoverRating || rating) ? 'currentColor' : 'none'}
              />
            </button>
          ))}
          <span className="ml-2 self-center text-sm text-earth-500">{rating}/5</span>
        </div>

        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Optional — describe the work and the worker's reliability."
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={300}
          aria-label="Review comment"
        />
        <div className="flex justify-end">
          <span className="text-xs text-earth-400">{comment.length}/300</span>
        </div>

        <button onClick={submitReview} disabled={loading} className="btn-primary" aria-busy={loading}>
          {loading ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Submitting…</> : 'Submit review'}
        </button>
      </div>
    )
  }

  return (
    <button onClick={completeJob} disabled={loading} className="btn-primary" aria-busy={loading}>
      {loading ? (
        <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Updating…</>
      ) : (
        'Mark as completed'
      )}
    </button>
  )
}
