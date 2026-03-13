import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-earth-50">
      <Navbar user={null} />
      <div className="page-shell flex min-h-[70vh] items-center justify-center">
        <div className="card max-w-lg text-center">
          <SearchX className="mx-auto mb-4 h-14 w-14 text-earth-300" />
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-earth-900">Page not found</h1>
          <p className="mb-8 text-earth-500">We could not find what you were looking for.</p>
          <Link href="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    </div>
  )
}
