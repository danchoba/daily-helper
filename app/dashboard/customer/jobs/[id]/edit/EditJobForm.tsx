'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category { id: string; name: string; icon?: string | null }
interface Job { id: string; title: string; description: string; categoryId: string; area: string; budget?: number | null; urgency: string; status: string }

export function EditJobForm({ job, categories }: { job: Job; categories: Category[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: job.title, description: job.description, categoryId: job.categoryId,
    area: job.area, budget: job.budget?.toString() || '', urgency: job.urgency
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget || null })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); return }
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  async function handleCancel() {
    if (!confirm('Cancel this job? This cannot be undone.')) return
    setCancelling(true)
    try {
      await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' })
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } finally { setCancelling(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
      <div>
        <label className="label">Job title</label>
        <input className="input" value={form.title} onChange={set('title')} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={4} value={form.description} onChange={set('description')} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.categoryId} onChange={set('categoryId')}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Urgency</label>
          <select className="input" value={form.urgency} onChange={set('urgency')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Location</label>
          <input className="input" value={form.area} onChange={set('area')} required />
        </div>
        <div>
          <label className="label">Budget (BWP)</label>
          <input type="number" className="input" value={form.budget} onChange={set('budget')} min="0" step="10" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving…' : 'Save Changes'}</button>
        <button type="button" onClick={handleCancel} disabled={cancelling} className="btn-danger btn-sm">{cancelling ? '…' : 'Cancel Job'}</button>
      </div>
    </form>
  )
}
