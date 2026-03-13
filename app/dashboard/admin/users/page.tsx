import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function AdminUsersPage() {
  const session = await getServerSession()
  if (!session || session.role !== 'ADMIN') redirect('/login')

  const users = await prisma.user.findMany({
    include: { workerProfile: { select: { trustedBadge: true, verificationStatus: true, jobsCompleted: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard/admin" className="text-earth-500 text-sm">← Admin</Link>
        <h1 className="page-title mt-2 mb-6">Users ({users.length})</h1>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-earth-100">
                <th className="pb-3 font-semibold text-earth-600">Name</th>
                <th className="pb-3 font-semibold text-earth-600">Email</th>
                <th className="pb-3 font-semibold text-earth-600">Role</th>
                <th className="pb-3 font-semibold text-earth-600">Status</th>
                <th className="pb-3 font-semibold text-earth-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-earth-50">
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="py-3 text-earth-500">{u.email}</td>
                  <td className="py-3">
                    <span className={`badge ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : u.role === 'WORKER' ? 'bg-blue-100 text-blue-700' : 'bg-sage-100 text-sage-700'}`}>{u.role}</span>
                  </td>
                  <td className="py-3">
                    {u.workerProfile?.trustedBadge && <span className="trusted-badge">✓ Trusted</span>}
                    {u.workerProfile?.verificationStatus === 'PENDING' && <span className="badge bg-yellow-100 text-yellow-700">Pending verification</span>}
                  </td>
                  <td className="py-3 text-earth-400">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
