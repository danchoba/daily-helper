import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-earth-950 text-earth-300 mt-20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="text-2xl font-display mb-3">
              <span className="text-brand-400">Daily</span>
              <span className="text-white"> Helper</span>
            </div>
            <p className="text-sm text-earth-400 leading-relaxed">Trusted local help, whenever you need it. Botswana's micro-gig marketplace.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link href="/signup?role=worker" className="hover:text-white transition-colors">Find Work</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-earth-400">Gaborone, Botswana</li>
              <li className="text-earth-400">hello@dailyhelper.bw</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-earth-800 pt-6 text-xs text-earth-500 text-center">
          © {new Date().getFullYear()} Daily Helper. All rights reserved. Prices in BWP.
        </div>
      </div>
    </footer>
  )
}
