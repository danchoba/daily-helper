'use client'
import Link from 'next/link'
import { useState } from 'react'
import { BriefcaseBusiness, LayoutDashboard, Menu, X } from 'lucide-react'

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
    <nav className="sticky top-0 z-50 border-b border-earth-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-earth-900 text-sm font-extrabold uppercase tracking-[0.12em] text-white">
            DH
          </span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-[0.14em] text-earth-900">Daily Helper</div>
            <div className="text-xs text-earth-500">Trusted local jobs and workers</div>
          </div>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/jobs" className="subtle-link inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-earth-50">
            <BriefcaseBusiness size={16} />
            Browse Jobs
          </Link>
          {user ? (
            <>
              {dashboardHref && (
                <Link href={dashboardHref} className="subtle-link inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-earth-50">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
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
          className="rounded-lg p-2 text-earth-700 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-earth-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Link href="/jobs" className="rounded-xl px-3 py-3 text-sm font-medium text-earth-800 hover:bg-earth-50" onClick={() => setMenuOpen(false)}>
              Browse Jobs
            </Link>
          {user ? (
            <>
              {dashboardHref && (
                <Link href={dashboardHref} className="rounded-xl px-3 py-3 text-sm font-medium text-earth-800 hover:bg-earth-50" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
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
        </div>
      )}
    </nav>
  )
}
