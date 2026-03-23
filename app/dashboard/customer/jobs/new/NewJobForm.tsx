'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'

interface Category {
  id: string
  name: string
  icon?: string | null
}

type FieldErrors = Partial<Record<'title' | 'description' | 'categoryId' | 'area', string>>

function charCountClass(current: number, max: number) {
  const pct = current / max
  if (pct >= 0.95) return 'text-red-500 font-semibold'
  if (pct >= 0.8) return 'text-orange-500'
  return 'text-earth-400'
}

export function NewJobForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const toast = useToast()
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(current => ({ ...current, [key]: e.target.value }))
    // Clear error on change
    setFieldErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!form.title.trim()) errors.title = 'Job title is required.'
    else if (form.title.trim().length < 5) errors.title = 'Title must be at least 5 characters.'
    if (!form.description.trim()) errors.description = 'Description is required.'
    else if (form.description.trim().length < 20) errors.description = 'Describe the job in at least 20 characters.'
    if (!form.categoryId) errors.categoryId = 'Please select a category.'
    if (!form.area.trim()) errors.area = 'Location or area is required.'
    return errors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, budget: form.budget || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to create job.')
        return
      }
      toast.success('Job posted successfully!')
      router.push('/dashboard/customer/jobs')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-6">
      <div>
        <div className="kicker mb-2">Job details</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Create a clear job listing</h2>
        <p className="mt-1 text-sm text-earth-500">Workers are more likely to apply when the task, area, and timing are specific.</p>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
        Write the listing as if the worker has never seen the location or task before. Clear expectations usually produce stronger applications.
      </div>

      <div>
        <label className="label" htmlFor="job-title">
          Job title <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="job-title"
          className={`input ${fieldErrors.title ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
          value={form.title}
          onChange={set('title')}
          placeholder="Example: Deep clean a 3-bedroom house"
          maxLength={100}
          aria-describedby={fieldErrors.title ? 'title-error' : undefined}
          aria-invalid={!!fieldErrors.title}
        />
        <div className="mt-1 flex items-start justify-between gap-2">
          {fieldErrors.title ? (
            <p id="title-error" role="alert" className="text-xs text-red-600">{fieldErrors.title}</p>
          ) : <span />}
          <span className={`shrink-0 text-xs ${charCountClass(form.title.length, 100)}`}>{form.title.length}/100</span>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="job-description">
          Description <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="job-description"
          className={`input resize-none ${fieldErrors.description ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
          rows={5}
          value={form.description}
          onChange={set('description')}
          placeholder="Describe what needs to be done, expected timing, tools or materials needed, and anything the worker should know before applying."
          maxLength={1000}
          aria-describedby={fieldErrors.description ? 'description-error' : 'description-hint'}
          aria-invalid={!!fieldErrors.description}
        />
        <div className="mt-1 flex items-start justify-between gap-2">
          {fieldErrors.description ? (
            <p id="description-error" role="alert" className="text-xs text-red-600">{fieldErrors.description}</p>
          ) : (
            <p id="description-hint" className="text-xs text-earth-400">Be specific about tools, access, timing, and expectations.</p>
          )}
          <span className={`shrink-0 text-xs ${charCountClass(form.description.length, 1000)}`}>{form.description.length}/1000</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="job-category">
            Category <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="job-category"
            className={`input ${fieldErrors.categoryId ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
            value={form.categoryId}
            onChange={set('categoryId')}
            aria-describedby={fieldErrors.categoryId ? 'category-error' : undefined}
            aria-invalid={!!fieldErrors.categoryId}
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {fieldErrors.categoryId && (
            <p id="category-error" role="alert" className="mt-1 text-xs text-red-600">{fieldErrors.categoryId}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="job-urgency">Urgency</label>
          <select id="job-urgency" className="input" value={form.urgency} onChange={set('urgency')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="job-area">
            Location or area <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="job-area"
            className={`input ${fieldErrors.area ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
            value={form.area}
            onChange={set('area')}
            placeholder="Example: Gaborone, Phase 2"
            aria-describedby={fieldErrors.area ? 'area-error' : undefined}
            aria-invalid={!!fieldErrors.area}
          />
          {fieldErrors.area && (
            <p id="area-error" role="alert" className="mt-1 text-xs text-red-600">{fieldErrors.area}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="job-budget">
            Budget (BWP) <span className="font-normal text-earth-400">optional</span>
          </label>
          <input
            id="job-budget"
            type="number"
            className="input"
            value={form.budget}
            onChange={set('budget')}
            placeholder="Example: 300"
            min="0"
            step="10"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="job-date">
          Preferred date <span className="font-normal text-earth-400">optional</span>
        </label>
        <input id="job-date" type="date" className="input" value={form.preferredDate} onChange={set('preferredDate')} />
      </div>

      <div className="flex flex-col gap-3 border-t border-earth-200 pt-4 sm:flex-row">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? 'Posting job…' : 'Post job'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  )
}
