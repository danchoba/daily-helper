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
    if (!paymentReference.trim()) { setError('Payment reference is required'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/worker/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentReference })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to submit'); return }
      setSuccess(true)
      router.refresh()
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="card text-center">
      <div className="text-4xl mb-3">✅</div>
      <h2 className="text-xl font-display mb-2">Request submitted!</h2>
      <p className="text-earth-600">Your verification request is being reviewed. We'll update your profile within 1-2 business days.</p>
    </div>
  )

  return (
    <div className="space-y-4">
      <Alert variant="info">
        <p className="font-semibold mb-1">How Trusted Verification works</p>
        <p className="text-sm">Pay a one-time verification fee of <strong>BWP 50</strong>, then submit your payment reference. An admin will review your request and activate your Trusted badge.</p>
      </Alert>

      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-4">Payment Instructions</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-earth-100">
            <span className="text-earth-500">Verification fee (one-time)</span>
            <span className="font-bold text-earth-900">BWP 50.00</span>
          </div>
          <div className="flex justify-between py-2 border-b border-earth-100">
            <span className="text-earth-500">Orange Money</span>
            <span className="font-semibold">+267 71 000 001</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-earth-500">Reference to use</span>
            <span className="font-semibold">VERIFY-[your name]</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-4">Submit your request</h3>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Payment reference / Transaction ID</label>
            <input className="input" value={paymentReference} onChange={e => setPaymentReference(e.target.value)}
              required placeholder="e.g. ORANGE-2024-VER-001234" />
          </div>
          <Alert variant="warning">
            <p className="text-sm">⚠️ <strong>MVP Manual Flow:</strong> Payment verification is done manually by our admin team. This is not an automated payment system.</p>
          </Alert>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting…' : 'Submit Verification Request'}
          </button>
        </form>
      </div>
    </div>
  )
}
