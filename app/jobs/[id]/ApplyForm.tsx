'use client'
import { useState } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const MAX_MESSAGE = 600

function charCountClass(current: number, max: number) {
  const pct = current / max
  if (pct >= 0.95) return 'text-red-500 font-semibold'
  if (pct >= 0.8) return 'text-orange-500'
  return 'text-earth-400'
}

export default function ApplyForm({ jobId, hasApplied }: { jobId: string; hasApplied: boolean }) {
  const toast = useToast()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [messageError, setMessageError] = useState('')

  if (hasApplied || success) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-success-200 bg-success-50 p-4">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-success-800">
            {hasApplied ? 'Already applied' : 'Application submitted!'}
          </p>
          <p className="mt-0.5 text-sm text-success-700">
            {hasApplied
              ? 'You have already applied to this job. The customer will review your profile.'
              : 'The customer will review your profile and message shortly.'}
          </p>
        </div>
      </div>
    )
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) {
      setMessageError('Please write a message before applying.')
      return
    }
    if (message.trim().length < 20) {
      setMessageError('Your message should be at least 20 characters.')
      return
    }
    setMessageError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to apply.')
        return
      }
      setSuccess(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="kicker mb-2">Apply</div>
      <h2 className="mb-4 text-xl font-bold tracking-tight text-earth-950">Submit your application</h2>
      <form onSubmit={handleApply} noValidate className="space-y-4">
        <div>
          <label className="label" htmlFor="apply-message">
            Your message <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <textarea
            id="apply-message"
            className={`input resize-none ${messageError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
            rows={4}
            value={message}
            onChange={e => { setMessage(e.target.value); setMessageError('') }}
            placeholder="Introduce yourself, describe your relevant experience, and explain why you are a good fit for this job."
            maxLength={MAX_MESSAGE}
            aria-describedby={messageError ? 'apply-message-error' : undefined}
            aria-invalid={!!messageError}
          />
          <div className="mt-1 flex items-start justify-between gap-2">
            {messageError ? (
              <p id="apply-message-error" role="alert" className="text-xs text-red-600">{messageError}</p>
            ) : <span />}
            <span className={`shrink-0 text-xs ${charCountClass(message.length, MAX_MESSAGE)}`}>{message.length}/{MAX_MESSAGE}</span>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full" aria-busy={loading}>
          {loading ? (
            <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Submitting…</>
          ) : (
            <><Send size={15} aria-hidden="true" /> Submit Application</>
          )}
        </button>
      </form>
    </div>
  )
}
