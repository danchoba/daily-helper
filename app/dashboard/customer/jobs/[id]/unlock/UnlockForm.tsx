'use client'
import Link from 'next/link'
import { useState } from 'react'
import { CreditCard, ReceiptText, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'

interface Props {
  jobId: string
  workerId: string
  workerName: string
}

export function UnlockForm({ jobId, workerId, workerName }: Props) {
  const [reference, setReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reference.trim()) {
      setError('Payment reference is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/jobs/${jobId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, paymentReference: reference }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit')
        return
      }
      setSuccess(true)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success-100 text-success-700">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-earth-950">Payment reference submitted</h2>
        <p className="mt-2 text-sm leading-6 text-earth-600">
          Your payment is being reviewed. Once approved, {workerName}&rsquo;s phone number will be unlocked. This usually takes up to 24 hours.
        </p>
        <Link href={`/dashboard/customer/jobs/${jobId}/applicants`} className="btn-outline mt-5">
          Back to applicants
        </Link>
      </div>
    )
  }

  const paymentDetails: { label: string; value: string; icon: LucideIcon }[] = [
    { label: 'Amount', value: 'BWP 25.00', icon: CreditCard },
    { label: 'Orange Money', value: '+267 71 000 001', icon: ReceiptText },
    { label: 'MyZaka', value: '+267 71 000 001', icon: ReceiptText },
    { label: 'Reference', value: `UNLOCK-${jobId.slice(0, 6).toUpperCase()}`, icon: ShieldCheck },
  ]

  return (
    <div className="space-y-4">
      <Alert variant="warning">
        <p className="font-semibold">Manual payment review</p>
        <p className="mt-1 text-sm leading-6">
          Send <strong>BWP 25</strong> using one of the methods below, then submit the payment reference. An admin reviews and unlocks contact details after confirmation.
        </p>
      </Alert>

      <div className="card">
        <div className="kicker mb-2">Payment instructions</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Connection fee details</h2>
        <div className="mt-5 grid gap-3">
          {paymentDetails.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between rounded-2xl border border-earth-200 bg-earth-50 px-4 py-3 text-sm">
              <span className="inline-flex items-center gap-2 text-earth-500">
                <Icon size={15} />
                {label}
              </span>
              <span className="font-semibold text-earth-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="kicker mb-2">Submit payment</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Unlocking contact for {workerName}</h2>
        <p className="mt-2 text-sm text-earth-500">After completing the transfer, enter the transaction reference below.</p>
        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="label">Payment reference or transaction ID</label>
            <input
              className="input"
              value={reference}
              onChange={event => setReference(event.target.value)}
              required
              placeholder="Example: ORANGE-2024-001234"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting payment...' : 'Submit payment reference'}
          </button>
        </form>
      </div>
    </div>
  )
}
