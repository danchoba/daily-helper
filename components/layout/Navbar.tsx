'use client'
import Link from 'next/link'
import { useState } from 'react'

interface NavbarProps {
  user?: { name: string; role: string } | null
}

export function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const dashboardHref = user
    ? user.role === 'ADMIN'
      ? '/dashboard/admin'
      : user.role === 'WORKER'
        ? '/dashboard/worker'
        : '/dashboard/customer'
    : null

  return (
    <nav className="bg-white border-b border-earth-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-display text-brand-600">Daily</span>
          <span className="text-2xl font-display text-earth-800">Helper</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-earth-600 hover:text-earth-900 font-medium transition-colors">Browse Jobs</Link>
          {user ? (
            <>
              {dashboardHref && (
                <Link href={dashboardHref} className="text-earth-600 hover:text-earth-900 font-medium transition-colors">Dashboard</Link>
              )}
              <form action="/api/auth/signout" method="POST">
                <button className="btn-outline btn-sm">Sign Out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-earth-600 hover:text-earth-900 font-medium transition-colors">Log In</Link>
              <Link href="/signup" className="btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-earth-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-earth-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/jobs" className="text-earth-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {user ? (
            <>
              {dashboardHref && (
                <Link href={dashboardHref} className="text-earth-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              )}
              <form action="/api/auth/signout" method="POST">
                <button className="btn-outline w-full">Sign Out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-earth-700 font-medium py-2" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link href="/signup" className="btn-primary w-full" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
