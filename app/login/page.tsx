'use client'
import { useState } from 'react'
import Link from 'next/link'
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
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Sign in failed'); return }
      const role = data.role
      if (role === 'ADMIN') router.push('/dashboard/admin')
      else if (role === 'WORKER') router.push('/dashboard/worker')
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
          <h1 className="text-2xl font-display text-earth-900 mb-2">Welcome back</h1>
          <p className="text-earth-500 text-sm mb-6">Sign in to your account</p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-earth-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-brand-600 font-medium hover:underline">Sign up</Link>
          </p>
          <div className="mt-6 pt-4 border-t border-earth-100">
            <p className="text-xs text-earth-400 text-center font-medium mb-2">Demo accounts</p>
            <div className="space-y-1 text-xs text-earth-500">
              <div>Admin: admin@dailyhelper.bw / admin123</div>
              <div>Customer: thabo@example.com / password123</div>
              <div>Worker: kgosi@example.com / password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
