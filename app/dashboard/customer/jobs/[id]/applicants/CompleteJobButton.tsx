'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
        body: JSON.stringify({ status: 'COMPLETED' })
      })
      if (res.ok) setShowReview(true)
    } finally { setLoading(false) }
  }

  async function submitReview() {
    setLoading(true)
    try {
      await fetch(`/api/jobs/${jobId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, rating, comment })
      })
      setDone(true)
      router.refresh()
    } finally { setLoading(false) }
  }

  if (done) return <p className="text-sage-700 font-medium text-sm">✓ Job completed and review submitted!</p>

  if (showReview) return (
    <div className="space-y-3">
      <p className="font-medium text-earth-800 text-sm">Leave a review for the worker</p>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? 'text-brand-500' : 'text-earth-200'}`}>★</button>
        ))}
      </div>
      <textarea className="input resize-none" rows={2} placeholder="Optional comment..." value={comment} onChange={e => setComment(e.target.value)} />
      <button onClick={submitReview} disabled={loading} className="btn-primary btn-sm">
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  )

  return (
    <button onClick={completeJob} disabled={loading} className="btn-primary btn-sm">
      {loading ? 'Updating…' : 'Mark Job as Completed'}
    </button>
  )
}
