'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  icon?: string | null
}

interface Job {
  id: string
  title: string
  description: string
  categoryId: string
  area: string
  budget?: number | null
  urgency: string
  status: string
}

export function EditJobForm({ job, categories }: { job: Job; categories: Category[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: job.title,
    description: job.description,
    categoryId: job.categoryId,
    area: job.area,
    budget: job.budget?.toString() || '',
    urgency: job.urgency,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(current => ({ ...current, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save changes')
        return
      }
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel this job? This cannot be undone.')) return
    setCancelling(true)
    try {
      await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' })
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } finally {
      setCancelling(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <div className="kicker mb-2">Edit listing</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Update the job details</h2>
        <p className="mt-1 text-sm text-earth-500">Keep the listing accurate so applicants understand the work and current requirements.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div>
        <label className="label">Job title</label>
        <input className="input" value={form.title} onChange={set('title')} required />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={5} value={form.description} onChange={set('description')} required />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <select className="input" value={form.categoryId} onChange={set('categoryId')}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
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

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Location</label>
          <input className="input" value={form.area} onChange={set('area')} required />
        </div>
        <div>
          <label className="label">Budget (BWP)</label>
          <input type="number" className="input" value={form.budget} onChange={set('budget')} min="0" step="10" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-earth-200 pt-4 sm:flex-row">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving changes...' : 'Save changes'}
        </button>
        <button type="button" onClick={handleCancel} disabled={cancelling} className="btn-danger">
          {cancelling ? 'Cancelling...' : 'Cancel job'}
        </button>
      </div>
    </form>
  )
}
