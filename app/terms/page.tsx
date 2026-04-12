import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getServerSession } from '@/lib/session'

export const metadata = {
  title: 'Terms of Service — Daily Helper',
  description: 'The rules and conditions for using Daily Helper, Botswana\'s local job marketplace.',
}

export default async function TermsPage() {
  const session = await getServerSession()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="page-shell max-w-3xl">
        <div className="mb-8">
          <div className="kicker mb-2">Legal</div>
          <h1 className="page-title">Terms of Service</h1>
          <p className="mt-2 text-sm text-earth-500">Last updated: April 2026 · Effective date: April 2026</p>
        </div>

        <div className="card space-y-8 text-earth-700 text-sm leading-7">

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">1. About Daily Helper</h2>
            <p>Daily Helper is an online marketplace (&ldquo;the platform&rdquo;) that connects individuals seeking local services (&ldquo;customers&rdquo;) with independent service providers (&ldquo;workers&rdquo;) across Botswana. By creating an account or using the platform you agree to these Terms of Service.</p>
            <p className="mt-2">Daily Helper is a marketplace only. We are not an employer, staffing agency, or party to any agreement between customers and workers. All service arrangements are made directly between users.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">2. Eligibility</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You must be at least 18 years old to use the platform</li>
              <li>You must provide accurate and truthful information when registering</li>
              <li>One account per person — creating multiple accounts to circumvent bans is prohibited</li>
              <li>By using the platform you confirm you have the legal capacity to enter into a binding agreement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">3. Customer responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Post accurate job descriptions including realistic budgets and locations</li>
              <li>Do not post jobs that are illegal, fraudulent, or harmful</li>
              <li>Communicate respectfully with workers</li>
              <li>Pay workers directly as agreed — Daily Helper does not process payments</li>
              <li>Leave honest reviews based on actual experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">4. Worker responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Apply only to jobs you are genuinely qualified and available to complete</li>
              <li>Show up when agreed, or notify the customer promptly if you cannot</li>
              <li>Provide the services as described in your application</li>
              <li>Keep your profile information accurate and up to date</li>
              <li>Do not solicit customers outside the platform to avoid reviews or accountability</li>
              <li>Submit genuine identity documents if applying for Trusted Badge verification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">5. Prohibited conduct</h2>
            <p>The following are strictly prohibited and may result in immediate account suspension:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>Posting false, misleading, or fraudulent job listings or applications</li>
              <li>Harassment, threats, or abusive language toward other users</li>
              <li>Sharing another user&apos;s personal contact information without consent</li>
              <li>Creating fake reviews or manipulating the rating system</li>
              <li>Using the platform to solicit services unrelated to posted jobs</li>
              <li>Attempting to circumvent platform safety features or identity verification</li>
              <li>Any illegal activity including unlicensed professional services where a licence is required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">6. Payments and disputes</h2>
            <p>Daily Helper does not process or hold payments. All financial arrangements are made directly between customers and workers, typically in cash or via mobile money (Orange Money, BTC Wallet, MyZaka). Daily Helper accepts no liability for payment disputes.</p>
            <p className="mt-2">If a dispute arises, users may report the issue through the platform. We will review reports and may take action including removing listings, suspending accounts, or referring matters to appropriate authorities.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">7. Reviews and ratings</h2>
            <p>Reviews are permanent once submitted. You may not request the removal of a legitimate negative review. Daily Helper may remove reviews that violate our prohibited conduct rules (e.g. abusive language, factually false claims). The platform&apos;s average rating calculations are automated and not manually adjusted.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">8. Trusted Badge verification</h2>
            <p>The Trusted Badge indicates that a worker&apos;s identity has been reviewed against a submitted document. It is not a guarantee of quality, character, or professional qualifications. Customers should exercise independent judgement when selecting workers for sensitive tasks.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">9. Limitation of liability</h2>
            <p>Daily Helper provides the platform &ldquo;as is&rdquo; without warranties of any kind. To the maximum extent permitted by Botswana law, we are not liable for:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>The quality, safety, or legality of services provided by workers</li>
              <li>Losses arising from payment disputes between users</li>
              <li>Personal injury, property damage, or loss resulting from a job arranged through the platform</li>
              <li>Platform downtime, data loss, or service interruptions</li>
            </ul>
            <p className="mt-2">Our total liability in any circumstance is limited to BWP 500.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">10. Intellectual property</h2>
            <p>You retain ownership of content you post (job descriptions, profile information, photos). By posting content you grant Daily Helper a non-exclusive, royalty-free licence to display it on the platform. You may not copy, reproduce, or distribute Daily Helper&apos;s interface, branding, or code.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">11. Account termination</h2>
            <p>You may delete your account at any time by contacting <a href="mailto:hello@dailyhelper.bw" className="text-brand-700 hover:underline">hello@dailyhelper.bw</a>. We may suspend or terminate accounts that violate these terms, with or without prior notice. Termination does not affect rights or obligations that arose before the termination date.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">12. Governing law</h2>
            <p>These terms are governed by the laws of the Republic of Botswana. Any disputes shall be subject to the exclusive jurisdiction of the courts of Botswana.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">13. Changes to these terms</h2>
            <p>We may update these terms from time to time. We will notify registered users by email at least 14 days before material changes take effect. Continued use of the platform after the effective date constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">14. Contact</h2>
            <div className="rounded-xl border border-earth-200 bg-earth-50 p-4">
              <p className="font-semibold text-earth-900">Daily Helper</p>
              <p>Gaborone, Botswana</p>
              <p><a href="mailto:hello@dailyhelper.bw" className="text-brand-700 hover:underline">hello@dailyhelper.bw</a></p>
            </div>
          </section>
        </div>

        <div className="mt-6 flex gap-4 text-sm">
          <Link href="/privacy" className="subtle-link">Privacy Policy →</Link>
          <Link href="/" className="subtle-link">← Back to home</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
