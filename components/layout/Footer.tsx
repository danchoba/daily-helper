import Link from 'next/link'
import { BriefcaseBusiness, MapPin, Mail, ArrowUpRight } from 'lucide-react'

const links = {
  Platform: [
    { href: '/jobs', label: 'Browse Jobs' },
    { href: '/signup', label: 'Post a Job' },
    { href: '/signup?role=worker', label: 'Find Work' },
  ],
  Account: [
    { href: '/login', label: 'Log In' },
    { href: '/signup', label: 'Sign Up' },
    { href: '/signup?role=worker', label: 'Worker Profile' },
  ],
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-earth-100 bg-earth-950">
      {/* BG glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-brand-600/10 blur-[80px]" />
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-accent-600/8 blur-[80px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
        {/* Top row */}
        <div className="mb-12 grid gap-10 md:grid-cols-[1.4fr,1fr,1fr]">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-black tracking-widest text-white">
                DH
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight text-white">Daily Helper</div>
                <div className="text-xs text-earth-500">Trusted local jobs platform</div>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-earth-400">
              A mobile-first marketplace for practical everyday jobs in Botswana. Built for clarity, safety, and speed.
            </p>
            <div className="mt-5 space-y-2 text-sm text-earth-500">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-earth-600" />
                Gaborone, Botswana
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-earth-600" />
                hello@dailyhelper.bw
              </div>
            </div>
          </div>

          {/* Nav links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-earth-500">{section}</h4>
              <ul className="space-y-3">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-1.5 text-sm text-earth-400 transition-colors hover:text-white"
                    >
                      {label}
                      <ArrowUpRight size={11} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-earth-800 to-transparent" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-earth-600 md:flex-row">
          <span>© {new Date().getFullYear()} Daily Helper. All rights reserved. Prices in BWP.</span>
          <div className="flex items-center gap-1">
            <BriefcaseBusiness size={12} />
            <span>Botswana's trusted local jobs marketplace</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
