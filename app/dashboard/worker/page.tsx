import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default async function WorkerDashboard() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'WORKER') redirect('/dashboard/' + (session.role === 'ADMIN' ? 'admin' : 'customer'))

  const [profile, pendingApps, openJobs] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId: session.id } }),
    prisma.jobApplication.count({ where: { workerId: session.id, status: 'PENDING' } }),
    prisma.job.count({ where: { status: 'OPEN' } })
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="page-title">Welcome, {session.name.split(' ')[0]}!</h1>
            <p className="text-earth-500 mt-1">Find jobs and grow your reputation</p>
          </div>
          {profile?.trustedBadge ? (
            <span className="trusted-badge text-base px-4 py-2">✓ Trusted Worker</span>
          ) : (
            <Link href="/dashboard/worker/verification" className="btn-outline btn-sm">Get Trusted Badge</Link>
          )}
        </div>

        {!profile?.bio && (
          <div className="card bg-brand-50 border-brand-200 mb-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-brand-800">Complete your profile</p>
              <p className="text-brand-700 text-sm">Add your bio, area, and services to attract more jobs.</p>
            </div>
            <Link href="/dashboard/worker/profile" className="btn-primary btn-sm flex-shrink-0">Complete Profile</Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Open Jobs', value: openJobs, href: '/dashboard/worker/jobs', icon: '🔍' },
            { label: 'My Applications', value: pendingApps + ' pending', href: '/dashboard/worker/applications', icon: '📋' },
            { label: 'My Profile', value: '→', href: '/dashboard/worker/profile', icon: '👤' },
            { label: 'Verification', value: profile?.verificationStatus || 'NONE', href: '/dashboard/worker/verification', icon: '🪪' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="card hover:shadow-md transition-shadow text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-base font-bold text-earth-900 mb-1">{item.value}</div>
              <div className="text-xs text-earth-500">{item.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-earth-800 mb-2">Rating</h3>
            <div className="text-3xl font-bold text-brand-600 mb-1">
              {profile?.averageRating ? `⭐ ${profile.averageRating}` : '—'}
            </div>
            <p className="text-earth-500 text-sm">{profile?.jobsCompleted || 0} jobs completed</p>
          </div>
          <div className="card">
            <h3 className="font-semibold text-earth-800 mb-2">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/dashboard/worker/jobs" className="block text-brand-600 hover:underline text-sm">→ Browse open jobs</Link>
              <Link href="/dashboard/worker/applications" className="block text-brand-600 hover:underline text-sm">→ View my applications</Link>
              <Link href="/dashboard/worker/profile" className="block text-brand-600 hover:underline text-sm">→ Edit my profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
