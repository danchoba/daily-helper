'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function AdminActionButtons({ id, type }: { id: string; type: 'verification' | 'payment' }) {
  const router = useRouter()
  const [loading, setLoading] = useState('')
  const [notes, setNotes] = useState('')

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action)
    const url = type === 'verification' ? `/api/admin/verifications/${id}` : `/api/admin/payments/${id}`
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, notes }),
    })
    if (res.ok) router.refresh()
    setLoading('')
  }

  return (
    <div className="space-y-3">
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Admin notes (optional)"
        rows={2}
        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 resize-none"
      />
      <div className="flex gap-2">
        <Button onClick={() => handleAction('approve')} loading={loading === 'approve'} size="sm">
          ✓ Approve
        </Button>
        <Button onClick={() => handleAction('reject')} loading={loading === 'reject'} variant="danger" size="sm">
          ✗ Reject
        </Button>
      </div>
    </div>
  )
}
