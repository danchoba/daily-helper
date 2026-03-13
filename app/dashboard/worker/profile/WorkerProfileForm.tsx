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

  function toggleService(s: string) {
    setForm(f => ({
      ...f,
      servicesOffered: f.servicesOffered.includes(s)
        ? f.servicesOffered.filter(x => x !== s)
        : [...f.servicesOffered, s]
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess(false)
    try {
      const res = await fetch('/api/worker/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed'); return }
      setSuccess(true)
      router.refresh()
    } catch { setError('Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
      {success && <div className="bg-sage-50 border border-sage-200 text-sage-800 rounded-xl p-3 text-sm">✓ Profile updated successfully!</div>}
      <div>
        <label className="label">Bio</label>
        <textarea className="input resize-none" rows={4} value={form.bio}
          onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
          placeholder="Tell customers about yourself, your experience, and what makes you a great helper..." maxLength={500} />
        <p className="text-xs text-earth-400 mt-1">{form.bio.length}/500</p>
      </div>
      <div>
        <label className="label">Service area / Location</label>
        <input className="input" value={form.area}
          onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
          placeholder="e.g. Gaborone, Francistown" />
      </div>
      <div>
        <label className="label">Services offered</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {serviceOptions.map(s => (
            <button key={s} type="button" onClick={() => toggleService(s)}
              className={`badge cursor-pointer transition-all text-sm py-1.5 px-3 ${
                form.servicesOffered.includes(s) ? 'bg-brand-500 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Phone number <span className="text-earth-400 font-normal">(shown to customers after unlock)</span></label>
        <input className="input bg-earth-50 cursor-not-allowed" value={phoneNumber || 'Not set — update in account settings'} readOnly />
        <p className="text-xs text-earth-400 mt-1">Your phone number is only revealed to customers after they pay the connection fee.</p>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
