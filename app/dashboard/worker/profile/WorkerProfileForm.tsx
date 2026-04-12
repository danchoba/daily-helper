'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { ImagePlus, Loader2, X } from 'lucide-react'

interface Props {
  profile: { bio?: string | null; area?: string | null; servicesOffered: string[]; portfolioUrls?: string[]; isAvailable?: boolean } | null
  phoneNumber: string
  serviceOptions: string[]
}

function charCountClass(current: number, max: number) {
  const pct = current / max
  if (pct >= 0.95) return 'text-red-500 font-semibold'
  if (pct >= 0.8) return 'text-orange-500'
  return 'text-earth-400'
}

export function WorkerProfileForm({ profile, phoneNumber, serviceOptions }: Props) {
  const router = useRouter()
  const toast = useToast()
  const [form, setForm] = useState({
    bio: profile?.bio || '',
    area: profile?.area || '',
    servicesOffered: profile?.servicesOffered || [],
    portfolioUrls: profile?.portfolioUrls || [],
    isAvailable: profile?.isAvailable ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [bioError, setBioError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function toggleService(service: string) {
    setForm(current => ({
      ...current,
      servicesOffered: current.servicesOffered.includes(service)
        ? current.servicesOffered.filter(item => item !== service)
        : [...current.servicesOffered, service],
    }))
  }

  async function handlePortfolioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (form.portfolioUrls.length >= 6) {
      toast.error('Maximum 6 portfolio photos allowed.')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'portfolio')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Upload failed'); return }
      setForm(f => ({ ...f, portfolioUrls: [...f.portfolioUrls, data.url] }))
    } catch {
      toast.error('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removePortfolioPhoto(url: string) {
    setForm(f => ({ ...f, portfolioUrls: f.portfolioUrls.filter(u => u !== url) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (form.bio && form.bio.trim().length < 10) {
      setBioError('Bio must be at least 10 characters if provided.')
      return
    }
    setBioError('')
    setLoading(true)

    try {
      const res = await fetch('/api/worker/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to save your profile.')
        return
      }
      toast.success('Profile updated successfully!')
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
        <div className="kicker mb-2">Worker profile</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Present your services clearly</h2>
        <p className="mt-1 text-sm text-earth-500">A complete profile makes it easier for customers to trust your application.</p>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-800">
        Focus on specific services, local area coverage, and the kind of work you reliably complete. This profile is part of your hiring signal.
      </div>

      <div>
        <label className="label" htmlFor="worker-bio">Bio</label>
        <textarea
          id="worker-bio"
          className={`input resize-none ${bioError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
          rows={5}
          value={form.bio}
          onChange={e => {
            setForm(current => ({ ...current, bio: e.target.value }))
            setBioError('')
          }}
          placeholder="Describe your experience, the kind of work you do well, and what customers can expect when they hire you."
          maxLength={500}
          aria-describedby={bioError ? 'bio-error' : 'bio-count'}
          aria-invalid={!!bioError}
        />
        <div className="mt-1 flex items-start justify-between gap-2">
          {bioError ? (
            <p id="bio-error" role="alert" className="text-xs text-red-600">{bioError}</p>
          ) : <span id="bio-count" />}
          <span className={`shrink-0 text-xs ${charCountClass(form.bio.length, 500)}`}>{form.bio.length}/500</span>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="worker-area">Service area or location</label>
        <input
          id="worker-area"
          className="input"
          value={form.area}
          onChange={e => setForm(current => ({ ...current, area: e.target.value }))}
          placeholder="Example: Gaborone, Francistown"
        />
      </div>

      <div>
        <label className="label">Services offered</label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select services you offer">
          {serviceOptions.map(service => {
            const selected = form.servicesOffered.includes(service)
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
                  selected
                    ? 'border-earth-900 bg-earth-900 text-white'
                    : 'border-earth-200 bg-white text-earth-700 hover:border-earth-300 hover:bg-earth-50'
                }`}
              >
                {service}
              </button>
            )
          })}
        </div>
        {form.servicesOffered.length === 0 && (
          <p className="mt-2 text-xs text-earth-400">Select at least one service to improve your profile.</p>
        )}
      </div>

      {/* Portfolio photos */}
      <div>
        <label className="label">Portfolio photos <span className="font-normal text-earth-400">optional — max 6</span></label>
        <p className="mb-3 text-xs text-earth-500">Show customers examples of your past work to build trust.</p>
        <div className="flex flex-wrap gap-3">
          {form.portfolioUrls.map(url => (
            <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-earth-200">
              <img src={url} alt="Portfolio" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePortfolioPhoto(url)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-earth-900/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {form.portfolioUrls.length < 6 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-earth-200 text-earth-400 transition-colors hover:border-brand-300 hover:text-brand-500 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
              <span className="text-[10px] font-semibold">{uploading ? 'Uploading…' : 'Add photo'}</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handlePortfolioUpload}
          aria-label="Upload portfolio photo"
        />
      </div>

      {/* Availability toggle */}
      <div className="rounded-2xl border border-earth-200 bg-earth-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-earth-900">Available for work</p>
            <p className="mt-0.5 text-xs leading-5 text-earth-500">
              When off, your profile won&apos;t appear in worker listings and you won&apos;t receive new job matches.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={form.isAvailable}
            onClick={() => setForm(current => ({ ...current, isAvailable: !current.isAvailable }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
              form.isAvailable ? 'bg-sage-500' : 'bg-earth-300'
            }`}
          >
            <span className="sr-only">Toggle availability</span>
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                form.isAvailable ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className={`mt-3 text-xs font-semibold ${form.isAvailable ? 'text-sage-600' : 'text-earth-400'}`}>
          {form.isAvailable ? '✓ You are visible and open to new jobs' : '✕ You are hidden from new job listings'}
        </p>
      </div>

      <div className="rounded-2xl border border-earth-200 bg-earth-50 p-4">
        <label className="label">Phone number <span className="font-normal text-earth-400">(shown when selected)</span></label>
        <input className="input bg-white" value={phoneNumber || 'No phone number on file'} readOnly aria-readonly="true" />
        <p className="mt-2 text-xs leading-5 text-earth-500">
          Your phone number is revealed to a customer as soon as they select you for a job.
        </p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Saving profile…' : 'Save profile'}
      </button>
    </form>
  )
}
