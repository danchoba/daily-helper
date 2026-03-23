'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

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

function charCountClass(current: number, max: number) {
  const pct = current / max
  if (pct >= 0.95) return 'text-red-500 font-semibold'
  if (pct >= 0.8) return 'text-orange-500'
  return 'text-earth-400'
}

export function EditJobForm({ job, categories }: { job: Job; categories: Category[] }) {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState({
    title: job.title,
    description: job.description,
    categoryId: job.categoryId,
    area: job.area,
    budget: job.budget?.toString() || '',
    urgency: job.urgency,
  })
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(current => ({ ...current, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save changes.')
        return
      }
      toast.success('Job updated successfully!')
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel this job? This cannot be undone.')) return
    setCancelling(true)
    try {
      await fetch(`/api/jobs/${job.id}`, { method: 'DELETE' })
      toast.info('Job cancelled.')
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

      <div>
        <label className="label" htmlFor="edit-title">Job title</label>
        <input
          id="edit-title"
          className="input"
          value={form.title}
          onChange={set('title')}
          required
          maxLength={100}
        />
        <div className="mt-1 flex justify-end">
          <span className={`text-xs ${charCountClass(form.title.length, 100)}`}>{form.title.length}/100</span>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="edit-description">Description</label>
        <textarea
          id="edit-description"
          className="input resize-none"
          rows={5}
          value={form.description}
          onChange={set('description')}
          required
          maxLength={1000}
        />
        <div className="mt-1 flex justify-end">
          <span className={`text-xs ${charCountClass(form.description.length, 1000)}`}>{form.description.length}/1000</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="edit-category">Category</label>
          <select id="edit-category" className="input" value={form.categoryId} onChange={set('categoryId')}>
            {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="edit-urgency">Urgency</label>
          <select id="edit-urgency" className="input" value={form.urgency} onChange={set('urgency')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="edit-area">Location</label>
          <input id="edit-area" className="input" value={form.area} onChange={set('area')} required />
        </div>
        <div>
          <label className="label" htmlFor="edit-budget">Budget (BWP)</label>
          <input id="edit-budget" type="number" className="input" value={form.budget} onChange={set('budget')} min="0" step="10" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-earth-200 pt-4 sm:flex-row">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" onClick={handleCancel} disabled={cancelling} className="btn-danger">
          {cancelling ? 'Cancelling…' : 'Cancel job'}
        </button>
      </div>
    </form>
  )
}
