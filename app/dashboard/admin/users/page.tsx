import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export default async function AdminUsersPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const users = await prisma.user.findMany({
    include: { workerProfile: { select: { trustedBadge: true, verificationStatus: true, jobsCompleted: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const workerCount = users.filter(user => user.role === 'WORKER').length
  const trustedCount = users.filter(user => user.workerProfile?.trustedBadge).length
  const pendingCount = users.filter(user => user.workerProfile?.verificationStatus === 'PENDING').length

  return (
    <div>
        <Link href="/dashboard/admin" className="subtle-link inline-flex items-center gap-2">Back to admin</Link>
        <h1 className="page-title mt-3 mb-6">Users ({users.length})</h1>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="muted-panel p-4">
            <div className="kicker mb-1">Workers</div>
            <div className="text-2xl font-extrabold tracking-tight text-earth-950">{workerCount}</div>
          </div>
          <div className="muted-panel p-4">
            <div className="kicker mb-1">Trusted workers</div>
            <div className="text-2xl font-extrabold tracking-tight text-earth-950">{trustedCount}</div>
          </div>
          <div className="muted-panel p-4">
            <div className="kicker mb-1">Pending verification</div>
            <div className="text-2xl font-extrabold tracking-tight text-earth-950">{pendingCount}</div>
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-earth-200 text-left">
                <th className="pb-3 font-semibold text-earth-600">Name</th>
                <th className="pb-3 font-semibold text-earth-600">Email</th>
                <th className="pb-3 font-semibold text-earth-600">Role</th>
                <th className="pb-3 font-semibold text-earth-600">Status</th>
                <th className="pb-3 font-semibold text-earth-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-earth-50">
                  <td className="py-4 font-medium text-earth-900">{user.name}</td>
                  <td className="py-4 text-earth-600">{user.email}</td>
                  <td className="py-4">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${
                      user.role === 'ADMIN'
                        ? 'border border-red-200 bg-red-50 text-red-700'
                        : user.role === 'WORKER'
                          ? 'border border-blue-200 bg-blue-50 text-blue-700'
                          : 'border border-sage-200 bg-sage-50 text-sage-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {user.workerProfile?.trustedBadge && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-sage-200 bg-sage-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-sage-800">
                          <ShieldCheck size={12} />
                          Trusted
                        </span>
                      )}
                      {user.workerProfile?.verificationStatus === 'PENDING' && (
                        <span className="rounded-full border border-yellow-200 bg-yellow-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-yellow-800">
                          Pending verification
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-earth-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}
