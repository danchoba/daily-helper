'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function CloseJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClose() {
    if (!confirm('Close this job? It will no longer accept applications.')) return
    setLoading(true)
    await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CLOSED' }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClose} loading={loading} className="flex-1 text-sm justify-center">
      <X size={14} />Close job
    </Button>
  )
}

export function CompleteJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    if (!confirm('Mark this job as completed?')) return
    setLoading(true)
    await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button size="sm" onClick={handleComplete} loading={loading} className="flex-1 text-sm justify-center">
      <CheckCircle size={14} />Mark completed
    </Button>
  )
}
