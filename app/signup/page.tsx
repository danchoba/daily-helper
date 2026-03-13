'use client'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'worker' ? 'WORKER' : 'CUSTOMER'

  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', role: defaultRole })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setField = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(current => ({ ...current, [key]: event.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Signup failed')
        return
      }

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
    <div className="min-h-screen bg-earth-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 md:px-6 md:py-12">
        <Link href="/" className="mb-8 flex items-center gap-3 self-center md:self-start">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth-900 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
            DH
          </span>
          <div>
            <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-earth-900">Daily Helper</div>
            <div className="text-xs text-earth-500">Professional local marketplace</div>
          </div>
        </Link>

        <div className="grid flex-1 items-center gap-8 md:grid-cols-[1fr,460px]">
          <div className="hidden md:block">
            <div className="kicker mb-2">Create account</div>
            <h1 className="page-title">Join a cleaner local marketplace experience.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-earth-600">
              Customers can post jobs for free. Workers can build a credible profile, apply quickly, and request verification when ready.
            </p>
          </div>

          <div className="card w-full">
            <h1 className="text-2xl font-bold tracking-tight text-earth-950">Create your account</h1>
            <p className="mt-2 text-sm text-earth-500">Choose your role and complete the details below.</p>
            {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label">Account type</label>
                <select className="input" value={form.role} onChange={setField('role')}>
                  <option value="CUSTOMER">Customer: post jobs</option>
                  <option value="WORKER">Worker: find jobs</option>
                </select>
              </div>
              <div>
                <label className="label">Full name</label>
                <input className="input" value={form.name} onChange={setField('name')} required placeholder="Thabo Molefe" />
              </div>
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" value={form.email} onChange={setField('email')} required placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Phone number <span className="font-normal text-earth-400">(optional)</span></label>
                <input className="input" value={form.phoneNumber} onChange={setField('phoneNumber')} placeholder="+267 71 234 567" />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" className="input" value={form.password} onChange={setField('password')} required placeholder="At least 8 characters" minLength={8} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-earth-500">
              Already have an account? <Link href="/login" className="font-semibold text-earth-900 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-earth-50" />}>
      <SignupForm />
    </Suspense>
  )
}
