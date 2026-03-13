'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  icon?: string | null
}

export function NewJobForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    area: '',
    budget: '',
    preferredDate: '',
    urgency: 'MEDIUM',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(current => ({ ...current, [key]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.description || !form.categoryId || !form.area) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create job.')
        return
      }
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div>
        <div className="kicker mb-2">Job details</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Create a clear job listing</h2>
        <p className="mt-1 text-sm text-earth-500">Workers are more likely to apply when the task, area, and timing are specific.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div>
        <label className="label">Job title <span className="text-red-500">*</span></label>
        <input className="input" value={form.title} onChange={set('title')} required placeholder="Example: Deep clean a 3-bedroom house" maxLength={100} />
      </div>

      <div>
        <label className="label">Description <span className="text-red-500">*</span></label>
        <textarea
          className="input resize-none"
          rows={5}
          value={form.description}
          onChange={set('description')}
          required
          placeholder="Describe what needs to be done, expected timing, tools or materials needed, and anything the worker should know before applying."
          maxLength={1000}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Category <span className="text-red-500">*</span></label>
          <select className="input" value={form.categoryId} onChange={set('categoryId')} required>
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
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
          <label className="label">Location or area <span className="text-red-500">*</span></label>
          <input className="input" value={form.area} onChange={set('area')} required placeholder="Example: Gaborone, Phase 2" />
        </div>
        <div>
          <label className="label">Budget (BWP) <span className="font-normal text-earth-400">optional</span></label>
          <input type="number" className="input" value={form.budget} onChange={set('budget')} placeholder="Example: 300" min="0" step="10" />
        </div>
      </div>

      <div>
        <label className="label">Preferred date <span className="font-normal text-earth-400">optional</span></label>
        <input type="date" className="input" value={form.preferredDate} onChange={set('preferredDate')} />
      </div>

      <div className="flex flex-col gap-3 border-t border-earth-200 pt-4 sm:flex-row">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Posting job...' : 'Post job'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  )
}
