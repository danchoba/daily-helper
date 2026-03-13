import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navbar user={null} />
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl font-display text-earth-900 mb-3">Page not found</h1>
        <p className="text-earth-500 mb-8">We couldn't find what you were looking for.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  )
}
