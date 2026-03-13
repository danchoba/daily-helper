import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { getInitials } from '@/lib/utils'
import type { WorkerProfile, User } from '@prisma/client'

type WorkerCardWorker = WorkerProfile & { user: User }

export default function WorkerCard({ worker }: { worker: WorkerCardWorker }) {
  return (
    <Link href={`/workers/${worker.userId}`} className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
          {worker.profilePhotoUrl ? (
            <img src={worker.profilePhotoUrl} alt={worker.user.name} className="w-full h-full rounded-full object-cover" />
          ) : getInitials(worker.user.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm truncate">{worker.user.name}</p>
            {worker.trustedBadge && (
              <Badge variant="trusted">✓ Trusted</Badge>
            )}
          </div>
          {worker.area && <p className="text-xs text-gray-500">📍 {worker.area}</p>}
        </div>
      </div>

      {worker.bio && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{worker.bio}</p>}

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span>{worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'New'}</span>
          {worker.jobsCompleted > 0 && <span>· {worker.jobsCompleted} jobs</span>}
        </div>
        {worker.servicesOffered.length > 0 && (
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{worker.servicesOffered[0]}</span>
        )}
      </div>
    </Link>
  )
}
