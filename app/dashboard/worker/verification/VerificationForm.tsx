'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert } from '@/components/ui/Alert'

export function VerificationForm() {
  const router = useRouter()
  const [paymentReference, setPaymentReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!paymentReference.trim()) {
      setError('Payment reference is required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/worker/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentReference }),
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
          Your verification request is in the review queue. Your profile will update after an admin confirms the payment and approves the request.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Alert variant="info">
        <p className="font-semibold">How verification works</p>
        <p className="mt-1 text-sm leading-6">
          Pay the one-time verification fee of <strong>BWP 50</strong>, then submit the payment reference below for manual review.
        </p>
      </Alert>

      <div className="card">
        <div className="kicker mb-2">Payment instructions</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Verification fee details</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between border-b border-earth-200 py-2">
            <span className="text-earth-500">Verification fee</span>
            <span className="font-semibold text-earth-900">BWP 50.00</span>
          </div>
          <div className="flex justify-between border-b border-earth-200 py-2">
            <span className="text-earth-500">Orange Money</span>
            <span className="font-semibold text-earth-900">+267 71 000 001</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-earth-500">Reference format</span>
            <span className="font-semibold text-earth-900">VERIFY-[your name]</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="kicker mb-2">Submit request</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Send your payment reference</h2>
        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="label">Payment reference or transaction ID</label>
            <input
              className="input"
              value={paymentReference}
              onChange={event => setPaymentReference(event.target.value)}
              required
              placeholder="Example: ORANGE-2024-VER-001234"
            />
          </div>
          <Alert variant="warning">
            <p className="text-sm leading-6">
              This is a manual payment process. Do not submit multiple requests for the same payment reference.
            </p>
          </Alert>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting request...' : 'Submit verification request'}
          </button>
        </form>
      </div>
    </div>
  )
}
