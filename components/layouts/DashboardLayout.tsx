'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { SessionUser } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

function customerNav(): NavItem[] {
  return [
    { label: 'Overview', href: '/dashboard/customer', icon: <HomeIcon /> },
    { label: 'My Jobs', href: '/dashboard/customer/jobs', icon: <BriefcaseIcon /> },
    { label: 'Post a Job', href: '/dashboard/customer/jobs/new', icon: <PlusIcon /> },
    { label: 'Reviews', href: '/dashboard/customer/reviews', icon: <StarIcon /> },
  ]
}

function workerNav(): NavItem[] {
  return [
    { label: 'Overview', href: '/dashboard/worker', icon: <HomeIcon /> },
    { label: 'Browse Jobs', href: '/dashboard/worker/jobs', icon: <SearchIcon /> },
    { label: 'Applications', href: '/dashboard/worker/applications', icon: <FileIcon /> },
    { label: 'My Profile', href: '/dashboard/worker/profile', icon: <UserIcon /> },
    { label: 'Verification', href: '/dashboard/worker/verification', icon: <ShieldIcon /> },
  ]
}

function adminNav(): NavItem[] {
  return [
    { label: 'Overview', href: '/dashboard/admin', icon: <HomeIcon /> },
    { label: 'Users', href: '/dashboard/admin/users', icon: <UsersIcon /> },
    { label: 'Jobs', href: '/dashboard/admin/jobs', icon: <BriefcaseIcon /> },
    { label: 'Verifications', href: '/dashboard/admin/verifications', icon: <ShieldIcon /> },
    { label: 'Payments', href: '/dashboard/admin/payments', icon: <CreditCardIcon /> },
  ]
}

interface DashboardLayoutProps {
  children: React.ReactNode
  user: SessionUser
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = user.role === 'admin' ? adminNav() : user.role === 'worker' ? workerNav() : customerNav()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="bg-white border-b border-gray-200 md:hidden sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="text-lg font-bold text-blue-600">Daily Helper</Link>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium capitalize">{user.role}</span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-56 min-h-screen bg-white border-r border-gray-200 fixed">
          <div className="p-4 border-b border-gray-100">
            <Link href="/" className="text-lg font-bold text-blue-600">Daily Helper</Link>
            <p className="text-xs text-gray-500 mt-1 capitalize">{user.role} Account</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-3 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 md:ml-56">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40">
        <div className="flex">
          {nav.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2 text-xs transition-colors',
                pathname === item.href ? 'text-blue-600' : 'text-gray-400'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}

// Simple inline icons
function HomeIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> }
function BriefcaseIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
function PlusIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> }
function StarIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> }
function SearchIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function FileIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
function UserIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
function ShieldIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> }
function UsersIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> }
function CreditCardIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> }
