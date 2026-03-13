'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  jobId: string
  applicationId: string
  workerName: string
}

export function SelectApplicantButton({ jobId, applicationId, workerName }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSelect() {
    if (!confirm(`Select ${workerName} for this job? Other pending applications will be rejected.`)) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/jobs/${jobId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to select this applicant')
        return
      }
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button onClick={handleSelect} disabled={loading} className="btn-primary">
        {loading ? 'Selecting applicant...' : `Select ${workerName}`}
      </button>
    </div>
  )
}
