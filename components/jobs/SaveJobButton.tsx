'use client'
import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SaveJobButtonProps {
  jobId: string
  initialSaved: boolean
}

export function SaveJobButton({ jobId, initialSaved }: SaveJobButtonProps) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, {
        method: saved ? 'DELETE' : 'POST',
      })
      if (res.ok) setSaved(v => !v)
    } catch {}
    finally { setLoading(false) }
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? 'Remove from saved' : 'Save job'}
      aria-pressed={saved}
      disabled={loading}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-xl border transition-colors',
        saved
          ? 'border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100'
          : 'border-earth-200 bg-white text-earth-400 hover:border-brand-200 hover:text-brand-500',
      )}
    >
      <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
    </button>
  )
}
