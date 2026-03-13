'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'worker' ? 'WORKER' : 'CUSTOMER'

  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', role: defaultRole })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Signup failed'); return }
      if (data.role === 'WORKER') router.push('/dashboard/worker')
      else router.push('/dashboard/customer')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col">
      <div className="flex items-center justify-center p-4 pt-8">
        <Link href="/" className="text-2xl font-display">
          <span className="text-brand-600">Daily</span>
          <span className="text-earth-800"> Helper</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="card w-full max-w-sm">
          <h1 className="text-2xl font-display text-earth-900 mb-2">Create your account</h1>
          <p className="text-earth-500 text-sm mb-6">Join Daily Helper today — it's free</p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">I want to</label>
              <select className="input" value={form.role} onChange={set('role')}>
                <option value="CUSTOMER">Post jobs (Customer)</option>
                <option value="WORKER">Find work (Worker)</option>
              </select>
            </div>
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={set('name')} required placeholder="Thabo Molefe" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" value={form.email} onChange={set('email')} required placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Phone number <span className="text-earth-400 font-normal">(optional)</span></label>
              <input className="input" value={form.phoneNumber} onChange={set('phoneNumber')} placeholder="+267 71 234 567" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={set('password')} required placeholder="At least 8 characters" minLength={8} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-earth-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
