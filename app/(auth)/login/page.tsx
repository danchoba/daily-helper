'use client'
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/customer'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }
    // Redirect based on role - fetch session
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    const role = session?.user?.role
    if (role === 'worker') router.push('/dashboard/worker')
    else if (role === 'admin') router.push('/dashboard/admin')
    else router.push('/dashboard/customer')
  }

  return (
    <div className="card p-8">
      <h1 className="font-display text-2xl font-bold text-earth-900 mb-1">Welcome back</h1>
      <p className="text-earth-500 text-sm mb-6">Sign in to your Daily Helper account</p>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
          <AlertCircle size={16} />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" />
        <Button type="submit" loading={loading} className="w-full">Sign In</Button>
      </form>

      <p className="text-center text-earth-500 text-sm mt-6">
        Don't have an account?{' '}
        <Link href="/signup" className="text-brand-600 font-semibold hover:underline">Sign up</Link>
      </p>

      <div className="mt-6 p-4 bg-earth-50 rounded-xl text-xs text-earth-500">
        <p className="font-semibold mb-1">Demo accounts:</p>
        <p>Customer: customer@demo.com / demo123</p>
        <p>Worker: worker@demo.com / demo123</p>
        <p>Admin: admin@demo.com / demo123</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="card p-8 animate-pulse h-64" />}>
      <LoginForm />
    </Suspense>
  )
}
