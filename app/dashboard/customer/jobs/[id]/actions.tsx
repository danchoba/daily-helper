'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { X, CheckCircle } from 'lucide-react'

export function CloseJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClose() {
    if (!confirm('Close this job? It will no longer accept applications.')) return
    setLoading(true)
    await fetch(`/api/jobs/${jobId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'closed' }) })
    router.refresh()
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleClose} loading={loading} className="flex-1 text-sm justify-center flex items-center gap-1.5">
      <X size={14} />Close Job
    </Button>
  )
}

export function CompleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (!confirm('Mark this job as completed?')) return
    setLoading(true)
    await fetch(`/api/jobs/${jobId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'completed' }) })
    router.refresh()
  }

  return (
    <Button size="sm" onClick={handleComplete} loading={loading} className="flex-1 text-sm justify-center flex items-center gap-1.5 bg-forest-500 hover:bg-forest-600">
      <CheckCircle size={14} />Mark Completed
    </Button>
  )
}
