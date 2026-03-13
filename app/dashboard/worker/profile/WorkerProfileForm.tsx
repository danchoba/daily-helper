'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  profile: { bio?: string | null; area?: string | null; servicesOffered: string[] } | null
  phoneNumber: string
  serviceOptions: string[]
}

export function WorkerProfileForm({ profile, phoneNumber, serviceOptions }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    bio: profile?.bio || '',
    area: profile?.area || '',
    servicesOffered: profile?.servicesOffered || [],
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  function toggleService(service: string) {
    setForm(current => ({
      ...current,
      servicesOffered: current.servicesOffered.includes(service)
        ? current.servicesOffered.filter(item => item !== service)
        : [...current.servicesOffered, service],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/worker/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save your profile.')
        return
      }
      setSuccess(true)
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
        <div className="kicker mb-2">Worker profile</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Present your services clearly</h2>
        <p className="mt-1 text-sm text-earth-500">A complete profile makes it easier for customers to trust your application.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-800">Your profile has been updated.</div>}

      <div>
        <label className="label">Bio</label>
        <textarea
          className="input resize-none"
          rows={5}
          value={form.bio}
          onChange={e => setForm(current => ({ ...current, bio: e.target.value }))}
          placeholder="Describe your experience, the kind of work you do well, and what customers can expect when they hire you."
          maxLength={500}
        />
        <p className="mt-1 text-xs text-earth-400">{form.bio.length}/500 characters</p>
      </div>

      <div>
        <label className="label">Service area or location</label>
        <input
          className="input"
          value={form.area}
          onChange={e => setForm(current => ({ ...current, area: e.target.value }))}
          placeholder="Example: Gaborone, Francistown"
        />
      </div>

      <div>
        <label className="label">Services offered</label>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map(service => {
            const selected = form.servicesOffered.includes(service)
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
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
      </div>

      <div className="rounded-2xl border border-earth-200 bg-earth-50 p-4">
        <label className="label">Phone number <span className="font-normal text-earth-400">(revealed after unlock)</span></label>
        <input className="input bg-white" value={phoneNumber || 'No phone number on file'} readOnly />
        <p className="mt-2 text-xs leading-5 text-earth-500">
          Customers only see your phone number after they select you and complete the connection fee process.
        </p>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Saving profile...' : 'Save profile'}
      </button>
    </form>
  )
}
