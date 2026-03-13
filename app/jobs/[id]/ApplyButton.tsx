'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleApply() {
    if (!message.trim()) { setError('Please write a short message'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to apply'); return }
      setSuccess(true)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-sage-50 border border-sage-200 text-sage-800 rounded-xl p-3 text-sm">
        ✓ Application submitted successfully!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
      <textarea
        className="input resize-none"
        rows={3}
        placeholder="Write a short message about yourself and why you're a good fit..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        maxLength={500}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-earth-400">{message.length}/500</span>
        <button onClick={handleApply} disabled={loading} className="btn-primary btn-sm">
          {loading ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    </div>
  )
}
