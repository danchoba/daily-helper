'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AlertCircle, Briefcase, Hammer } from 'lucide-react'
import { cn } from '@/lib/utils'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'worker' ? 'worker' : 'customer'

  const [role, setRole] = useState<'customer' | 'worker'>(defaultRole as any)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phoneNumber: phone }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) { setError('Login after signup failed'); return }
      router.push(role === 'worker' ? '/dashboard/worker' : '/dashboard/customer')
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-8">
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-1">Create account</h1>
      <p className="text-earth-500 text-sm mb-6">Join Daily Helper to post jobs or find work</p>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(['customer', 'worker'] as const).map(r => (
          <button key={r} type="button" onClick={() => setRole(r)}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all',
              role === r ? 'border-brand-500 bg-brand-50' : 'border-earth-200 hover:border-earth-300'
            )}>
            {r === 'customer' ? <Briefcase size={20} className={cn(role === r ? 'text-brand-600' : 'text-earth-400')} /> : <Hammer size={20} className={cn(role === r ? 'text-brand-600' : 'text-earth-400')} />}
            <p className={cn('font-semibold mt-2 text-sm', role === r ? 'text-brand-700' : 'text-earth-700')}>
              {r === 'customer' ? 'I need help' : 'I want to work'}
            </p>
            <p className="text-xs text-earth-400 mt-0.5">{r === 'customer' ? 'Post jobs' : 'Find gigs'}</p>
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          <AlertCircle size={16} />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name" />
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        <Input label="Phone Number" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+267 7x xxx xxx" hint="Used when you are hired for a job" />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 6 characters" />
        <Button type="submit" loading={loading} className="w-full">Create Account</Button>
      </form>

      <p className="text-center text-earth-500 text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="card p-8 animate-pulse h-96" />}>
      <SignupForm />
    </Suspense>
  )
}
