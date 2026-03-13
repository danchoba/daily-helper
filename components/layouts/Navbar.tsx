'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { SessionUser } from '@/types'

interface NavbarProps {
  user?: SessionUser | null
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const dashboardHref =
    user?.role === 'admin' ? '/dashboard/admin' :
    user?.role === 'worker' ? '/dashboard/worker' : '/dashboard/customer'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Daily Helper
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900">Browse Jobs</Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
                <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link href="/jobs" className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50">Browse Jobs</Link>
            {user ? (
              <>
                <Link href={dashboardHref} className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50">Dashboard</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50">Login</Link>
                <Link href="/signup" className="block px-3 py-2 text-sm text-blue-600 font-medium rounded-lg hover:bg-blue-50">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
