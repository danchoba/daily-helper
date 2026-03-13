'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { CheckCircle } from 'lucide-react'

export function ApplyButton({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleApply() {
    if (!message.trim()) { setError('Please write a short message'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, message }),
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

  if (success) {
    return (
      <div className="card p-5 text-center">
        <CheckCircle size={36} className="text-green-500 mx-auto mb-2" />
        <h3 className="font-display font-bold text-earth-900 mb-1">Application Sent!</h3>
        <p className="text-earth-500 text-sm">The customer will review your application.</p>
      </div>
    )
  }

  return (
    <div className="card p-5">
      {!open ? (
        <Button onClick={() => setOpen(true)} className="w-full">Apply for this Job</Button>
      ) : (
        <div className="space-y-4">
          <h3 className="font-display font-bold text-earth-900">Your Application</h3>
          <Textarea
            label="Message to customer"
            placeholder="Briefly explain your experience and why you're a good fit..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-3">
            <Button onClick={handleApply} loading={loading} className="flex-1">Submit Application</Button>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
