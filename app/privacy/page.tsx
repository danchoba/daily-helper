import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getServerSession } from '@/lib/session'

export const metadata = {
  title: 'Privacy Policy — Daily Helper',
  description: 'How Daily Helper collects, uses, and protects your personal information under the Botswana Data Protection Act 2018.',
}

export default async function PrivacyPage() {
  const session = await getServerSession()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <div className="page-shell max-w-3xl">
        <div className="mb-8">
          <div className="kicker mb-2">Legal</div>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="mt-2 text-sm text-earth-500">Last updated: April 2026 · Effective date: April 2026</p>
        </div>

        <div className="card prose prose-sm max-w-none space-y-8 text-earth-700">

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">1. Who we are</h2>
            <p>Daily Helper (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;the platform&rdquo;) is an online marketplace that connects customers with local service providers across Botswana. We operate at <strong>dailyhelper.bw</strong> and can be reached at <a href="mailto:hello@dailyhelper.bw" className="text-brand-700 hover:underline">hello@dailyhelper.bw</a>.</p>
            <p className="mt-2">This policy explains what personal information we collect, why we collect it, how we use and protect it, and your rights under the <strong>Botswana Data Protection Act, 2018 (DPA)</strong>.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">2. Information we collect</h2>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-earth-900">Account information</p>
                <p>When you register we collect your full name, email address, phone number, and chosen role (customer or worker). Phone numbers are only revealed to a customer when they select a worker for a job.</p>
              </div>
              <div>
                <p className="font-semibold text-earth-900">Profile information</p>
                <p>Workers may optionally add a bio, service area, services offered, and portfolio photos. This information is visible to customers on your public profile.</p>
              </div>
              <div>
                <p className="font-semibold text-earth-900">Job and application data</p>
                <p>Job listings, applications, messages, and reviews are stored so the platform can function and to provide a history of your activity.</p>
              </div>
              <div>
                <p className="font-semibold text-earth-900">Identity verification documents</p>
                <p>Workers who apply for a Trusted Badge submit an identity document. This is stored securely and reviewed only by our admin team. It is never shared with customers.</p>
              </div>
              <div>
                <p className="font-semibold text-earth-900">Location data</p>
                <p>If you grant permission, we use your device&apos;s GPS coordinates to detect your city and pre-fill the area filter. We do not store raw GPS coordinates — only the resolved city name, which is kept locally on your device.</p>
              </div>
              <div>
                <p className="font-semibold text-earth-900">Technical data</p>
                <p>We collect standard server logs including IP addresses and browser type for security and debugging purposes. This data is retained for 30 days.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">3. How we use your information</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To create and manage your account</li>
              <li>To match customers with appropriate local workers</li>
              <li>To send transactional emails (application alerts, selection notices, verification outcomes)</li>
              <li>To display your public worker profile to potential customers</li>
              <li>To review and approve worker identity verification requests</li>
              <li>To detect and prevent fraud, abuse, and violations of our Terms of Service</li>
              <li>To improve the platform based on aggregate usage patterns</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell your personal data to third parties. We do not use your data for advertising profiling.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">4. Who we share data with</h2>
            <div className="space-y-2">
              <p><strong>Resend</strong> — email delivery service. Your email address and name are transmitted to send transactional notifications.</p>
              <p><strong>Supabase</strong> — our database and file storage provider, hosted in the EU (AWS eu-west-1). All data is encrypted at rest and in transit.</p>
              <p><strong>Vercel</strong> — our hosting provider. They may process request logs in the course of serving the application.</p>
              <p>All third-party providers are bound by data processing agreements and are prohibited from using your data for their own purposes.</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">5. Data retention</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Active accounts: retained as long as the account exists</li>
              <li>Deleted accounts: personal data removed within 30 days of deletion request</li>
              <li>Job listings and reviews: retained for 2 years after completion for dispute resolution</li>
              <li>Identity verification documents: deleted within 90 days of review completion</li>
              <li>Server logs: 30 days</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">6. Your rights under the DPA 2018</h2>
            <p>Under the Botswana Data Protection Act you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Correction</strong> — request that inaccurate data be corrected</li>
              <li><strong>Deletion</strong> — request that your account and associated personal data be deleted</li>
              <li><strong>Objection</strong> — object to specific types of processing</li>
              <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:hello@dailyhelper.bw" className="text-brand-700 hover:underline">hello@dailyhelper.bw</a>. We will respond within 21 days.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">7. Cookies</h2>
            <p>We use a single <strong>essential session cookie</strong> (<code>dh_token</code>) to keep you logged in. This cookie is strictly necessary for the platform to function and does not require your consent under the DPA. It expires after 7 days of inactivity.</p>
            <p className="mt-2">We do not use advertising, analytics, or third-party tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">8. Security</h2>
            <p>All data is transmitted over HTTPS. Passwords are hashed using bcrypt before storage — we never store plain-text passwords. Access to production systems is restricted to authorised personnel only.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">9. Children</h2>
            <p>Daily Helper is not intended for use by persons under the age of 18. We do not knowingly collect personal data from children. If you believe a minor has created an account, contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">10. Changes to this policy</h2>
            <p>We may update this policy from time to time. We will notify registered users by email when material changes are made. Continued use of the platform after the effective date constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-earth-950 mb-3">11. Contact</h2>
            <p>For privacy concerns or data requests:</p>
            <div className="mt-2 rounded-xl border border-earth-200 bg-earth-50 p-4 text-sm">
              <p className="font-semibold text-earth-900">Daily Helper</p>
              <p>Gaborone, Botswana</p>
              <p><a href="mailto:hello@dailyhelper.bw" className="text-brand-700 hover:underline">hello@dailyhelper.bw</a></p>
            </div>
          </section>
        </div>

        <div className="mt-6 flex gap-4 text-sm">
          <Link href="/terms" className="subtle-link">Terms of Service →</Link>
          <Link href="/" className="subtle-link">← Back to home</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
