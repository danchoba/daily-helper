'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert } from '@/components/ui/Alert'

export function VerificationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/worker/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit your request.')
        return
      }
      setSuccess(true)
      router.refresh()
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold tracking-tight text-earth-950">Request submitted</h2>
        <p className="mt-2 text-sm leading-6 text-earth-600">
          Your verification request is in the review queue. Your profile will update after an admin approves it.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Alert variant="info">
        <p className="font-semibold">How verification works</p>
        <p className="mt-1 text-sm leading-6">
          Submit a request and an admin will review your profile. Verified workers earn the <strong>Trusted badge</strong>, which increases your chances of being selected.
        </p>
      </Alert>

      <div className="card">
        <div className="kicker mb-2">What you get</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Trusted badge benefits</h2>
        <div className="mt-5 space-y-3 text-sm text-earth-600">
          <div className="flex items-start gap-3 rounded-xl border border-earth-100 bg-earth-50 p-3">
            <span className="mt-0.5 text-base">✓</span>
            <span>Your profile is highlighted with a Trusted badge visible to all customers</span>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-earth-100 bg-earth-50 p-3">
            <span className="mt-0.5 text-base">✓</span>
            <span>Customers are more likely to select verified workers</span>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-earth-100 bg-earth-50 p-3">
            <span className="mt-0.5 text-base">✓</span>
            <span>Your applications stand out in the applicant list</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="kicker mb-2">Request verification</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Apply for the Trusted badge</h2>
        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-5">
          <p className="mb-4 text-sm leading-6 text-earth-600">
            Make sure your profile is complete (bio, area, and services) before requesting. Admin will review your profile and approve or reject the request.
          </p>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting request...' : 'Submit verification request'}
          </button>
        </form>
      </div>
    </div>
  )
}
