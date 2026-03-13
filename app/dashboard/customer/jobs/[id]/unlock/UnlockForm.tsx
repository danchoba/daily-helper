'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert } from '@/components/ui/Alert'

interface Props { jobId: string; workerId: string; workerName: string }

export function UnlockForm({ jobId, workerId, workerName }: Props) {
  const router = useRouter()
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reference.trim()) { setError('Payment reference is required'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/jobs/${jobId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, paymentReference: reference })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to submit'); return }
      setSuccess(true)
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  if (success) return (
    <div className="card text-center">
      <div className="text-4xl mb-3">✅</div>
      <h2 className="text-xl font-display text-earth-900 mb-2">Payment reference submitted!</h2>
      <p className="text-earth-600 mb-4">Your payment is being reviewed. Once approved, {workerName}'s phone number will be unlocked. This usually takes up to 24 hours.</p>
      <Link href={`/dashboard/customer/jobs/${jobId}/applicants`} className="btn-outline btn-sm">← Back to Applicants</Link>
    </div>
  )

  return (
    <div className="space-y-4">
      <Alert variant="warning">
        <p className="font-semibold mb-1">⚠️ Manual Payment Flow (MVP)</p>
        <p className="text-sm">Daily Helper uses manual payment verification. Send <strong>BWP 25</strong> via Orange Money, MyZaka, or bank transfer to the account below, then enter your payment reference here. An admin will verify and unlock the contact within 24 hours.</p>
      </Alert>

      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-4">Payment Instructions</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-earth-100">
            <span className="text-earth-500">Amount</span>
            <span className="font-bold text-earth-900">BWP 25.00</span>
          </div>
          <div className="flex justify-between py-2 border-b border-earth-100">
            <span className="text-earth-500">Orange Money</span>
            <span className="font-semibold">+267 71 000 001</span>
          </div>
          <div className="flex justify-between py-2 border-b border-earth-100">
            <span className="text-earth-500">MyZaka</span>
            <span className="font-semibold">+267 71 000 001</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-earth-500">Reference</span>
            <span className="font-semibold">UNLOCK-{jobId.slice(0, 6).toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-1">Unlocking contact for: <span className="text-brand-600">{workerName}</span></h3>
        <p className="text-earth-500 text-sm mb-4">After making the payment, enter your transaction reference below.</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Payment reference / Transaction ID</label>
            <input className="input" value={reference} onChange={e => setReference(e.target.value)} required
              placeholder="e.g. ORANGE-2024-001234" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting…' : 'Submit Payment Reference'}
          </button>
        </form>
      </div>
    </div>
  )
}
