import Link from 'next/link'
import { MapPin, Star, BriefcaseBusiness, ShieldCheck } from 'lucide-react'
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
    <Link href={`/workers/${worker.id}`} className="block">
      <div className="card h-full transition-all duration-150 hover:-translate-y-0.5 hover:border-earth-300 hover:shadow-md">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-earth-900 text-base font-bold text-white">
            {worker.user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold tracking-tight text-earth-950">{worker.user.name}</h3>
              {worker.trustedBadge && (
                <TrustedBadge>
                  <ShieldCheck size={12} />
                  Trusted
                </TrustedBadge>
              )}
            </div>
            {worker.area && (
              <p className="flex items-center gap-1.5 text-sm text-earth-500">
                <MapPin size={14} />
                {worker.area}
              </p>
            )}
          </div>
        </div>

        {worker.bio && <p className="mb-4 line-clamp-3 text-sm leading-6 text-earth-600">{worker.bio}</p>}

        {worker.servicesOffered.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {worker.servicesOffered.slice(0, 3).map(service => (
              <span key={service} className="rounded-full border border-earth-200 bg-earth-50 px-2.5 py-1 text-xs font-medium text-earth-700">
                {service}
              </span>
            ))}
            {worker.servicesOffered.length > 3 && (
              <span className="rounded-full border border-earth-200 bg-white px-2.5 py-1 text-xs font-medium text-earth-500">
                +{worker.servicesOffered.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-earth-600">
          <span className="inline-flex items-center gap-1.5">
            <Star size={14} className="text-amber-500" />
            {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'No rating yet'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BriefcaseBusiness size={14} />
            {worker.jobsCompleted} completed jobs
          </span>
        </div>
      </div>
    </Link>
  )
}
