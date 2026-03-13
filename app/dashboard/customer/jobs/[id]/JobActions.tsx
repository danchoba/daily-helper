'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import type { Job, Review } from '@prisma/client'

interface Props {
  job: Job
  review: Review | null
  selectedApp: { workerId: string } | null
}

export default function JobActions({ job, review, selectedApp }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')
  const [showReview, setShowReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  async function markComplete() {
    setLoading('complete')
    const res = await fetch(`/api/jobs/${job.id}/complete`, { method: 'POST' })
    if (res.ok) router.refresh()
    else { const d = await res.json(); setError(d.error) }
    setLoading('')
  }

  async function closeJob() {
    setLoading('close')
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'closed' }),
    })
    if (res.ok) router.refresh()
    setLoading('')
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedApp) return
    const res = await fetch(`/api/jobs/${job.id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment, workerId: selectedApp.workerId }),
    })
    if (res.ok) { setShowReview(false); router.refresh() }
    else { const d = await res.json(); setError(d.error) }
  }

  return (
    <div className="space-y-3">
      {error && <Alert type="error">{error}</Alert>}

      {job.status === 'in_progress' && (
        <Button onClick={markComplete} loading={loading === 'complete'} variant="secondary" className="w-full">
          ✓ Mark as Completed
        </Button>
      )}

      {job.status === 'open' && (
        <Button onClick={closeJob} loading={loading === 'close'} variant="secondary" className="w-full">
          Close Job
        </Button>
      )}

      {job.status === 'completed' && !review && selectedApp && !showReview && (
        <Button onClick={() => setShowReview(true)} className="w-full">Leave a Review</Button>
      )}

      {showReview && (
        <form onSubmit={submitReview} className="bg-white rounded-xl border p-4 space-y-3">
          <h3 className="font-semibold">Leave a Review</h3>
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setRating(n)}
                  className={`text-2xl ${n <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
              ))}
            </div>
          </div>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Write a comment..." rows={3}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm" />
          <div className="flex gap-2">
            <Button type="submit" size="sm">Submit</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowReview(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {review && (
        <Alert type="success">
          You rated this worker {review.rating}/5 stars. {review.comment && `"${review.comment}"`}
        </Alert>
      )}
    </div>
  )
}
