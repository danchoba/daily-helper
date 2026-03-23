'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2, UserCheck } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface Props {
  jobId: string
  applicationId: string
  workerName: string
}

export function SelectApplicantButton({ jobId, applicationId, workerName }: Props) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(false)

  async function handleSelect() {
    if (!confirm(`Select ${workerName} for this job? Other pending applications will be rejected.`)) return
    setLoading(true)

    // Optimistic feedback
    setSelected(true)

    try {
      const res = await fetch(`/api/jobs/${jobId}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSelected(false)
        toast.error(data.error || 'Failed to select this applicant.')
        return
      }
      toast.success(`${workerName} selected! Contact unlock is now available.`)
      router.refresh()
    } catch {
      setSelected(false)
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (selected && !loading) {
    return (
      <div className="inline-flex items-center gap-2 text-sm font-semibold text-success-700">
        <CheckCircle2 size={16} />
        Selected
      </div>
    )
  }

  return (
    <button
      onClick={handleSelect}
      disabled={loading}
      className="btn-primary"
      aria-busy={loading}
    >
      {loading ? (
        <>
          <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          Selecting…
        </>
      ) : (
        <>
          <UserCheck size={15} aria-hidden="true" />
          Select {workerName}
        </>
      )}
    </button>
  )
}
