'use client'

import { BadgeCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'

const items = [
  { label: 'Verified workers', icon: BadgeCheck },
  { label: 'Private until you connect', icon: ShieldCheck },
  { label: 'Designed for mobile', icon: Sparkles },
] as const

export function CTABadges() {
  return (
    <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
      {items.map(({ label, icon: Icon }, index) => (
        <Reveal key={label} delay={index as 0 | 1 | 2}>
          <div className="rounded-[1.5rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                <Icon size={18} />
              </div>
              <div className="text-sm font-semibold text-white">{label}</div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
