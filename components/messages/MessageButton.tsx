'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MessageSquare } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface MessageButtonProps {
  jobId: string
  workerId: string
  /** The dashboard base path for the current user role */
  basePath: string
}

export function MessageButton({ jobId, workerId, basePath }: MessageButtonProps) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  async function openConversation() {
    setLoading(true)
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, workerId }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push(`${basePath}/messages/${data.conversationId}`)
      } else {
        toast.error(data.error ?? 'Could not open conversation.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={openConversation}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-60"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <MessageSquare size={15} />}
      Message
    </button>
  )
}
