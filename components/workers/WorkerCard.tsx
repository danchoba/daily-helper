'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, BriefcaseBusiness, MapPin, ShieldCheck, Star } from 'lucide-react'
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

const AVATAR_COLORS = [
  'from-brand-500 to-brand-700',
  'from-sage-500 to-sage-700',
  'from-accent-500 to-accent-700',
  'from-orange-500 to-orange-700',
]

export function WorkerCard({ worker }: WorkerCardProps) {
  const colorIndex = worker.user.name.charCodeAt(0) % AVATAR_COLORS.length

  return (
    <Link href={`/workers/${worker.id}`} className="block h-full" aria-label={`View profile: ${worker.user.name}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.005 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="group relative h-full overflow-hidden rounded-3xl border border-earth-200/80 bg-white shadow-card transition-shadow duration-300 hover:border-brand-200 hover:shadow-card-hover"
      >
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-sage-500 via-brand-400 to-accent-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="p-6">
          {/* Profile header */}
          <div className="mb-5 flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              transition={{ duration: 0.2 }}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-black text-white shadow-sm ${AVATAR_COLORS[colorIndex]}`}
            >
              {worker.user.name.charAt(0)}
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-earth-950">{worker.user.name}</h3>
                {worker.trustedBadge && (
                  <TrustedBadge>
                    <ShieldCheck size={11} aria-hidden="true" />
                    Trusted
                  </TrustedBadge>
                )}
              </div>
              {worker.area && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-earth-400">
                  <MapPin size={13} aria-hidden="true" />
                  {worker.area}
                </p>
              )}
            </div>
            <motion.div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 opacity-0 transition-opacity group-hover:opacity-100"
              initial={false}
            >
              <ArrowUpRight size={14} />
            </motion.div>
          </div>

          {/* Bio */}
          {worker.bio && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-earth-500">{worker.bio}</p>
          )}

          {/* Services */}
          {worker.servicesOffered.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-1.5">
              {worker.servicesOffered.slice(0, 3).map(service => (
                <span
                  key={service}
                  className="rounded-full border border-earth-100 bg-earth-50 px-2.5 py-1 text-xs font-semibold text-earth-600"
                >
                  {service}
                </span>
              ))}
              {worker.servicesOffered.length > 3 && (
                <span className="rounded-full border border-earth-100 bg-white px-2.5 py-1 text-xs font-semibold text-earth-400">
                  +{worker.servicesOffered.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between rounded-2xl border border-earth-100 bg-earth-50/60 px-4 py-3">
            <span className="flex items-center gap-1.5 text-sm">
              <Star size={14} className="text-neon-amber" aria-hidden="true" />
              <span className="font-bold text-earth-900" aria-label={`Rating: ${worker.averageRating > 0 ? worker.averageRating.toFixed(1) : 'not rated'}`}>
                {worker.averageRating > 0 ? worker.averageRating.toFixed(1) : '—'}
              </span>
              {worker.averageRating === 0 && <span className="text-earth-400">No rating</span>}
            </span>
            <div className="h-4 w-px bg-earth-200" />
            <span className="flex items-center gap-1.5 text-sm">
              <BriefcaseBusiness size={14} className="text-earth-400" aria-hidden="true" />
              <span className="font-bold text-earth-900">{worker.jobsCompleted}</span>
              <span className="text-earth-400">jobs</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
