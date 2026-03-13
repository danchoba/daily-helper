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
    if (!message.trim()) {
      setError('Please write a short message before submitting.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit your application.')
        return
      }

      setSuccess(true)
      router.refresh()
    } catch {
      setError('Something went wrong while submitting your application.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">
        Your application has been submitted successfully.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <textarea
        className="input resize-none"
        rows={4}
        placeholder="Briefly explain your relevant experience, availability, and why you are a good fit."
        value={message}
        onChange={e => setMessage(e.target.value)}
        maxLength={500}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-earth-400">{message.length}/500 characters</span>
        <button onClick={handleApply} disabled={loading} className="btn-primary">
          {loading ? 'Submitting application...' : 'Submit application'}
        </button>
      </div>
    </div>
  )
}
