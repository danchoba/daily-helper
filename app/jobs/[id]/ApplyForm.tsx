'use client'
import { useState } from 'react'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

export default function ApplyForm({ jobId, hasApplied }: { jobId: string; hasApplied: boolean }) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (hasApplied) {
    return <Alert type="success">You have already applied to this job.</Alert>
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!message.trim()) { setError('Please write a message'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to apply'); return }
      setSuccess(true)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) return <Alert type="success">Application submitted! The customer will review your profile.</Alert>

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Apply for this job</h2>
      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      <form onSubmit={handleApply} className="space-y-4">
        <Textarea
          label="Your message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
          placeholder="Introduce yourself and explain why you are a good fit for this job..."
          required
        />
        <Button type="submit" loading={loading}>Submit Application</Button>
      </form>
    </div>
  )
}
