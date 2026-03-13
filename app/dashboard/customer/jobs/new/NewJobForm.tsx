'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category { id: string; name: string; icon?: string | null }

export function NewJobForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', area: '',
    budget: '', preferredDate: '', urgency: 'MEDIUM'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.description || !form.categoryId || !form.area) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget || null })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to create job'); return }
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
      <div>
        <label className="label">Job title <span className="text-red-500">*</span></label>
        <input className="input" value={form.title} onChange={set('title')} required placeholder="e.g. Deep clean 3-bedroom house" maxLength={100} />
      </div>
      <div>
        <label className="label">Description <span className="text-red-500">*</span></label>
        <textarea className="input resize-none" rows={4} value={form.description} onChange={set('description')} required
          placeholder="Describe the job in detail. What needs to be done? Any special requirements?" maxLength={1000} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category <span className="text-red-500">*</span></label>
          <select className="input" value={form.categoryId} onChange={set('categoryId')} required>
            <option value="">Select category</option>
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
          <label className="label">Location / Area <span className="text-red-500">*</span></label>
          <input className="input" value={form.area} onChange={set('area')} required placeholder="e.g. Gaborone, Phase 2" />
        </div>
        <div>
          <label className="label">Budget (BWP) <span className="text-earth-400 font-normal">optional</span></label>
          <input type="number" className="input" value={form.budget} onChange={set('budget')} placeholder="e.g. 300" min="0" step="10" />
        </div>
      </div>
      <div>
        <label className="label">Preferred date <span className="text-earth-400 font-normal">optional</span></label>
        <input type="date" className="input" value={form.preferredDate} onChange={set('preferredDate')} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Posting…' : 'Post Job'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">Cancel</button>
      </div>
    </form>
  )
}
