'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Briefcase, LogOut, LayoutDashboard } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const dashboardHref = session?.user.role === 'worker'
    ? '/dashboard/worker'
    : session?.user.role === 'admin'
    ? '/dashboard/admin'
    : '/dashboard/customer'

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-earth-100">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-earth-900 text-lg">Daily Helper</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/jobs" className="text-earth-600 hover:text-brand-600 font-medium transition-colors">Browse Jobs</Link>
          {session ? (
            <div className="flex items-center gap-3">
              <Link href={dashboardHref} className="flex items-center gap-1.5 text-earth-700 hover:text-brand-600 font-medium transition-colors">
                <LayoutDashboard size={16} />Dashboard
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-1.5 text-earth-500 hover:text-red-600 font-medium transition-colors">
                <LogOut size={16} />Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-ghost text-sm py-2">Login</Link>
              <Link href="/signup" className="btn-primary text-sm py-2.5 px-4">Get Started</Link>
            </div>
          )}
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-earth-50">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-earth-100 bg-white px-4 py-4 space-y-3">
          <Link href="/jobs" className="block py-2 text-earth-700 font-medium" onClick={() => setMenuOpen(false)}>Browse Jobs</Link>
          {session ? (
            <>
              <Link href={dashboardHref} className="block py-2 text-earth-700 font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="block py-2 text-red-600 font-medium w-full text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-2 text-earth-700 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/signup" className="btn-primary block text-center mt-2" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
