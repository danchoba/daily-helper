import Link from 'next/link'
import { BadgeCheck, BriefcaseBusiness, ClipboardList, FileCheck2, UserRound } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'

export default async function WorkerDashboard() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'WORKER') redirect('/dashboard/' + (session.role === 'ADMIN' ? 'admin' : 'customer'))

  const [profile, pendingApps, openJobs] = await Promise.all([
    prisma.workerProfile.findUnique({ where: { userId: session.id } }),
    prisma.jobApplication.count({ where: { workerId: session.id, status: 'PENDING' } }),
    prisma.job.count({ where: { status: 'OPEN' } }),
  ])

  const stats = [
    {
      label: 'Open jobs',
      value: openJobs.toString(),
      href: '/dashboard/worker/jobs',
      icon: BriefcaseBusiness,
      description: 'Browse available work in the marketplace',
    },
    {
      label: 'Pending applications',
      value: pendingApps.toString(),
      href: '/dashboard/worker/applications',
      icon: ClipboardList,
      description: 'Track the jobs you have applied for',
    },
    {
      label: 'Profile',
      value: profile?.bio ? 'Complete' : 'Needs update',
      href: '/dashboard/worker/profile',
      icon: UserRound,
      description: 'Keep your profile clear and credible',
    },
    {
      label: 'Verification',
      value: profile?.verificationStatus || 'NONE',
      href: '/dashboard/worker/verification',
      icon: BadgeCheck,
      description: 'Strengthen trust with a verified badge',
    },
  ]

  return (
    <div>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="kicker mb-2">Worker dashboard</div>
            <h1 className="page-title">Welcome, {session.name.split(' ')[0]}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-earth-500">
              Keep your profile current, monitor application outcomes, and build trust through verification and completed work.
            </p>
          </div>
          {profile?.trustedBadge ? (
            <Badge className="border-sage-200 bg-sage-100 px-4 py-2 text-sage-800">
              <FileCheck2 size={14} />
              Trusted worker
            </Badge>
          ) : (
            <Link href="/dashboard/worker/verification" className="btn-outline">
              Request verification
            </Link>
          )}
        </div>

        {!profile?.bio && (
          <div className="mb-6 rounded-2xl border border-earth-200 bg-earth-50 p-5">
            <h2 className="text-lg font-bold tracking-tight text-earth-900">Complete your profile</h2>
            <p className="mt-1 text-sm text-earth-600">
              Add your bio, services, and operating area so customers can understand what you do before they shortlist you.
            </p>
            <Link href="/dashboard/worker/profile" className="btn-primary mt-4">
              Finish profile
            </Link>
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ icon: Icon, ...item }) => (
            <Link key={item.label} href={item.href} className="surface-card p-5 transition-colors hover:border-earth-300 hover:bg-earth-50">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-earth-100 text-earth-900">
                <Icon size={18} />
              </div>
              <div className="stat-value text-xl">{item.value}</div>
              <div className="mt-1 text-sm font-semibold text-earth-900">{item.label}</div>
              <div className="mt-2 text-sm leading-6 text-earth-500">{item.description}</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <div className="kicker mb-2">Performance</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Your work history</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="muted-panel p-4">
                <div className="kicker mb-1">Rating</div>
                <div className="font-semibold text-earth-900">
                  {profile?.averageRating ? profile.averageRating.toFixed(1) : 'Not rated yet'}
                </div>
              </div>
              <div className="muted-panel p-4">
                <div className="kicker mb-1">Completed jobs</div>
                <div className="font-semibold text-earth-900">{profile?.jobsCompleted || 0}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="kicker mb-2">Next steps</div>
            <h2 className="text-xl font-bold tracking-tight text-earth-950">Recommended actions</h2>
            <div className="mt-4 space-y-3 text-sm text-earth-600">
              <Link href="/dashboard/worker/jobs" className="block rounded-xl border border-earth-200 px-4 py-3 font-medium text-earth-800 hover:bg-earth-50">
                Browse current open jobs
              </Link>
              <Link href="/dashboard/worker/applications" className="block rounded-xl border border-earth-200 px-4 py-3 font-medium text-earth-800 hover:bg-earth-50">
                Review your application statuses
              </Link>
              <Link href="/dashboard/worker/profile" className="block rounded-xl border border-earth-200 px-4 py-3 font-medium text-earth-800 hover:bg-earth-50">
                Update your profile details
              </Link>
            </div>
          </div>
        </div>
    </div>
  )
}
