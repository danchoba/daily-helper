'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Sign in failed')
        return
      }

      if (data.role === 'ADMIN') router.push('/dashboard/admin')
      else if (data.role === 'WORKER') router.push('/dashboard/worker')
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

        <div className="grid flex-1 items-center gap-8 md:grid-cols-[1fr,440px]">
          <div className="hidden md:block">
            <div className="kicker mb-2">Sign in</div>
            <h1 className="page-title">Access your dashboard and keep work moving.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-earth-600">
              Customers manage jobs and applicants here. Workers track applications, profiles, and verification in one place.
            </p>
          </div>

          <div className="card w-full">
            <h1 className="text-2xl font-bold tracking-tight text-earth-950">Welcome back</h1>
            <p className="mt-2 text-sm text-earth-500">Sign in to continue to your Daily Helper account.</p>
            {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <input type="password" className="input" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Enter your password" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-earth-500">
              Do not have an account? <Link href="/signup" className="font-semibold text-earth-900 hover:underline">Create one</Link>
            </p>
            <div className="mt-6 rounded-2xl border border-earth-200 bg-earth-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-earth-500">Demo accounts</p>
              <div className="mt-3 space-y-1 text-sm text-earth-600">
                <div>Admin: admin@dailyhelper.bw / admin123</div>
                <div>Customer: thabo@example.com / password123</div>
                <div>Worker: kgosi@example.com / password123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
