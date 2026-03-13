import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-earth-200 bg-earth-950 text-earth-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="mb-10 grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-extrabold uppercase tracking-[0.14em] text-earth-950">
                DH
              </span>
              <div>
                <div className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">Daily Helper</div>
                <div className="text-xs text-earth-500">Professional local support</div>
              </div>
            </div>
            <p className="text-sm leading-6 text-earth-400">
              Trusted local help for practical everyday jobs. Daily Helper is a mobile-first marketplace built for clarity, safety, and speed.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="transition-colors hover:text-white">Browse Jobs</Link></li>
              <li><Link href="/signup" className="transition-colors hover:text-white">Post a Job</Link></li>
              <li><Link href="/signup?role=worker" className="transition-colors hover:text-white">Find Work</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="transition-colors hover:text-white">Log In</Link></li>
              <li><Link href="/signup" className="transition-colors hover:text-white">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-earth-400">Gaborone, Botswana</li>
              <li className="text-earth-400">hello@dailyhelper.bw</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-earth-800 pt-6 text-center text-xs text-earth-500">
          Copyright {new Date().getFullYear()} Daily Helper. All rights reserved. Prices shown in BWP.
        </div>
      </div>
    </footer>
  )
}
