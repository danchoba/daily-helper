import Link from 'next/link'
import { BadgeCheck, BriefcaseBusiness, CheckCircle2, Circle, ClipboardList, FileCheck2, Star, UserRound } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { StatCard, StatGrid } from '@/components/dashboard/StatCard'

export default async function WorkerDashboard() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'WORKER') redirect('/dashboard/' + (session.role === 'ADMIN' ? 'admin' : 'customer'))

  const [profile, pendingApps, acceptedApps, openJobs, completedApps] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId: session.id } }),
    prisma.jobApplication.count({ where: { workerId: session.id, status: 'PENDING' } }),
    prisma.jobApplication.count({ where: { workerId: session.id, status: 'SELECTED' } }),
    prisma.job.count({ where: { status: 'OPEN' } }),
    prisma.jobApplication.findMany({
      where: { workerId: session.id, status: 'SELECTED', job: { status: 'COMPLETED' } },
      include: { job: { select: { budget: true } } },
    }),
  ])

  const estimatedEarnings = completedApps.reduce((sum, app) => sum + (app.job.budget ?? 0), 0)

  const profileFields = [
    { label: 'Bio', done: !!profile?.bio },
    { label: 'Area', done: !!profile?.area },
    { label: 'Services', done: !!(profile?.servicesOffered?.length) },
  ]
  const profileCompleteness = profileFields.filter(f => f.done).length
  const profilePct = Math.round((profileCompleteness / 3) * 100)
  const firstName = session.name.split(' ')[0]

  const stats = [
    {
      label: 'Open jobs',
      value: openJobs.toString(),
      href: '/dashboard/worker/jobs',
      icon: <BriefcaseBusiness size={18} aria-hidden="true" />,
      description: openJobs > 0 ? `${openJobs} job${openJobs !== 1 ? 's' : ''} waiting — apply now` : 'No open jobs at the moment',
    },
    {
      label: 'Pending applications',
      value: pendingApps.toString(),
      href: '/dashboard/worker/applications',
      icon: <ClipboardList size={18} aria-hidden="true" />,
      description: pendingApps > 0 ? `${pendingApps} application${pendingApps !== 1 ? 's' : ''} awaiting a decision` : 'No pending applications',
    },
    {
      label: 'Selected',
      value: acceptedApps.toString(),
      href: '/dashboard/worker/applications',
      icon: <CheckCircle2 size={18} aria-hidden="true" />,
      description: acceptedApps > 0 ? `${acceptedApps} job${acceptedApps !== 1 ? 's' : ''} you've been shortlisted for` : 'Not shortlisted yet',
    },
    {
      label: 'Profile',
      value: profile?.bio ? 'Complete' : 'Needs update',
      href: '/dashboard/worker/profile',
      icon: <UserRound size={18} aria-hidden="true" />,
      description: profile?.bio ? 'Profile is complete — edit anytime' : 'Incomplete profile reduces visibility',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-sage-600">Worker dashboard</p>
          <h1 className="text-2xl font-black tracking-tight text-earth-950 md:text-3xl">
            Welcome, {firstName}
          </h1>
          <p className="mt-1.5 max-w-md text-sm leading-relaxed text-earth-500">
            Monitor applications, build your profile, and earn the trusted badge.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Availability badge */}
          <Link
            href="/dashboard/worker/profile"
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors hover:opacity-80 ${
              profile?.isAvailable !== false
                ? 'border-sage-200 bg-sage-50 text-sage-700'
                : 'border-earth-200 bg-earth-100 text-earth-500'
            }`}
            title="Change in Profile settings"
          >
            <span className={`h-2 w-2 rounded-full ${profile?.isAvailable !== false ? 'bg-sage-500' : 'bg-earth-400'}`} />
            {profile?.isAvailable !== false ? 'Available for work' : 'Unavailable'}
          </Link>

          {profile?.trustedBadge ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 px-4 py-2 text-sm font-bold text-sage-700">
              <FileCheck2 size={15} />
              Trusted worker
            </div>
          ) : (
            <Link href="/dashboard/worker/verification" className="btn-outline">
              Request verification
            </Link>
          )}
        </div>
      </div>

      {/* Profile + stats summary */}
      <div className="grid gap-4 md:grid-cols-[1.3fr,0.7fr]">
        {/* Profile completion card */}
        <div className="overflow-hidden rounded-2xl border border-earth-200/80 bg-white p-6 shadow-card">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-earth-400">Profile health</p>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-earth-950">Profile completion</h2>
            <span className="text-2xl font-extrabold text-brand-600">{profilePct}%</span>
          </div>

          {/* Progress bar */}
          <div
            className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-earth-100"
            role="progressbar"
            aria-valuenow={profilePct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400 transition-all duration-700"
              style={{ width: `${profilePct}%` }}
            />
          </div>

          {/* Field indicators */}
          <div className="grid grid-cols-3 gap-2">
            {profileFields.map(({ label, done }) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold ${
                  done
                    ? 'border-sage-200 bg-sage-50 text-sage-700'
                    : 'border-earth-200 bg-earth-50 text-earth-400'
                }`}
              >
                {done ? (
                  <CheckCircle2 size={12} className="text-sage-500" />
                ) : (
                  <Circle size={12} className="text-earth-300" />
                )}
                {label}
              </div>
            ))}
          </div>

          {!profile?.bio && (
            <Link href="/dashboard/worker/profile" className="btn-primary mt-4">
              Complete profile
            </Link>
          )}
        </div>

        {/* Performance card */}
        <div className="flex flex-col gap-3">
          <div className="flex-1 overflow-hidden rounded-2xl border border-earth-200/80 bg-white p-5 shadow-card">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">Performance</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-earth-100 bg-earth-50/60 p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-lg font-extrabold text-earth-950">
                  <Star size={14} className="text-neon-amber" />
                  {profile?.averageRating ? profile.averageRating.toFixed(1) : '—'}
                </div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-earth-400">Rating</div>
              </div>
              <div className="rounded-xl border border-earth-100 bg-earth-50/60 p-3 text-center">
                <div className="text-lg font-extrabold text-earth-950">{profile?.jobsCompleted || 0}</div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-earth-400">Jobs done</div>
              </div>
              <div className="col-span-2 rounded-xl border border-earth-100 bg-earth-50/60 p-3 text-center">
                <div className="text-lg font-extrabold text-earth-950">
                  BWP {estimatedEarnings.toLocaleString('en-BW', { minimumFractionDigits: 0 })}
                </div>
                <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-earth-400">Est. earnings</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-sage-50 p-5">
            <div className="flex items-start gap-2">
              <BadgeCheck size={16} className="mt-0.5 shrink-0 text-brand-500" />
              <div>
                <p className="text-xs font-bold text-brand-700">Build trust faster</p>
                <p className="mt-1 text-xs leading-relaxed text-earth-500">
                  Verified profiles get 3× more shortlists.
                </p>
                <Link href="/dashboard/worker/verification" className="mt-2 inline-block text-xs font-bold text-brand-600 hover:text-brand-700">
                  Get verified →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <StatGrid className="md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </StatGrid>

      {/* Quick actions */}
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-earth-400">Quick actions</p>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { href: '/dashboard/worker/jobs', label: 'Browse open jobs', desc: 'Find work nearby' },
            { href: '/dashboard/worker/applications', label: 'My applications', desc: 'Track decisions' },
            { href: '/dashboard/worker/profile', label: 'Update profile', desc: 'Improve visibility' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm font-semibold text-earth-800 shadow-sm transition-all hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            >
              <div>
                <div>{label}</div>
                <div className="text-xs font-normal text-earth-400">{desc}</div>
              </div>
              <span className="text-earth-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-400">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
