'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'

export function CompleteJobButton({ jobId, workerId }: { jobId: string; workerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
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
      if (res.ok) setShowReview(true)
    } finally {
      setLoading(false)
    }
  }

  async function submitReview() {
    setLoading(true)
    try {
      await fetch(`/api/jobs/${jobId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, rating, comment }),
      })
      setDone(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return <p className="text-sm font-medium text-sage-800">Job completed and review submitted.</p>
  }

  if (showReview) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-semibold text-earth-900">Leave a review for the worker</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(value => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`rounded-lg p-1 ${value <= rating ? 'text-amber-500' : 'text-earth-300'}`}
            >
              <Star size={24} fill={value <= rating ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Optional comment"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button onClick={submitReview} disabled={loading} className="btn-primary">
          {loading ? 'Submitting review...' : 'Submit review'}
        </button>
      </div>
    )
  }

  return (
    <button onClick={completeJob} disabled={loading} className="btn-primary">
      {loading ? 'Updating status...' : 'Mark as completed'}
    </button>
  )
}
