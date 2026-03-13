import Link from 'next/link'
import { MapPin, Star, Briefcase } from 'lucide-react'
import { TrustedBadge } from '@/components/ui/Badge'

interface WorkerCardProps {
  worker: {
    id: string
    area?: string | null
    bio?: string | null
    servicesOffered: string[]
    trustedBadge: boolean
    averageRating: number
    jobsCompleted: number
    user: { name: string }
  }
}

export function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <Link href={`/workers/${worker.id}`} className="block card p-4 hover:shadow-md hover:border-brand-200 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
          <span className="font-display font-bold text-brand-600 text-lg">{worker.user.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-earth-900">{worker.user.name}</h3>
            {worker.trustedBadge && <TrustedBadge />}
          </div>
          {worker.area && (
            <p className="text-sm text-earth-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} />{worker.area}
            </p>
          )}
        </div>
      </div>

      {worker.bio && <p className="text-sm text-earth-600 mb-3 line-clamp-2">{worker.bio}</p>}

      {worker.servicesOffered.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {worker.servicesOffered.slice(0, 3).map(service => (
            <span key={service} className="text-xs bg-earth-100 text-earth-600 px-2 py-0.5 rounded-full">{service}</span>
          ))}
          {worker.servicesOffered.length > 3 && (
            <span className="text-xs text-earth-400">+{worker.servicesOffered.length - 3} more</span>
          )}
        </div>
      )}

      <div className="flex gap-4 text-sm text-earth-500">
        {worker.averageRating > 0 && (
          <span className="flex items-center gap-1"><Star size={13} className="text-amber-500 fill-amber-500" />{worker.averageRating.toFixed(1)}</span>
        )}
        <span className="flex items-center gap-1"><Briefcase size={13} />{worker.jobsCompleted} jobs done</span>
      </div>
    </Link>
  )
}
