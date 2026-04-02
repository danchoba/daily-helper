'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const GRADIENTS = [
  'from-brand-500 to-accent-500',
  'from-sage-500 to-brand-500',
  'from-orange-400 to-accent-500',
  'from-neon-blue to-brand-600',
]

interface StatCardProps {
  label: string
  value: string
  description: string
  href: string
  icon: React.ReactNode
  index?: number
  highlight?: boolean
}

export function StatCard({ label, value, description, href, icon, index = 0, highlight }: StatCardProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={href} className="block h-full">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'group relative h-full overflow-hidden rounded-2xl border bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover',
            highlight ? 'border-brand-200' : 'border-earth-200/80',
          )}
        >
          {/* Hover accent stripe */}
          <div
            className={cn(
              'absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              gradient,
            )}
          />

          <div
            className={cn(
              'mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm',
              gradient,
            )}
          >
            {icon}
          </div>

          <div className="text-2xl font-extrabold tracking-tight text-earth-950">{value}</div>
          <div className="mt-1 text-sm font-semibold text-earth-800">{label}</div>
          <div className="mt-1.5 text-xs leading-5 text-earth-400">{description}</div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function StatGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-4', className)}>{children}</div>
}
