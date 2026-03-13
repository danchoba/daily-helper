import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/session'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { formatBWP } from '@/lib/utils'

export default async function HomePage() {
  const session = await getServerSession()

  const [recentJobs, trustedWorkers, categories] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'OPEN' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        customer: { select: { name: true } },
        _count: { select: { applications: true } }
      }
    }),
    prisma.workerProfile.findMany({
      where: { trustedBadge: true },
      take: 3,
      include: { user: { select: { id: true, name: true } } }
    }),
    prisma.category.findMany({ take: 8 })
  ])

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-earth-900 via-earth-800 to-earth-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-brand-400 blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-sage-500 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 text-sm font-medium">
            <span>🇧🇼</span> Botswana's trusted micro-gig marketplace
          </div>
          <h1 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
            Book trusted local help
            <br />
            <span className="text-brand-400">in minutes</span>
          </h1>
          <p className="text-earth-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            From house cleaning to garden work, plumbing to errands — find verified local helpers nearby and get things done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
              Post a Job — It's Free
            </Link>
            <Link href="/jobs" className="btn-secondary text-lg px-8 py-4 bg-white/10 text-white hover:bg-white/20 border border-white/20">
              Browse Open Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="section-title text-center mb-3">How Daily Helper works</h2>
        <p className="text-earth-500 text-center mb-12 max-w-xl mx-auto">Three simple steps to get local help fast</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', icon: '📝', title: 'Post your job', desc: 'Describe what you need, set your budget and location. Takes 2 minutes.' },
            { step: '2', icon: '👥', title: 'Receive applications', desc: 'Local workers apply with a short message. Review their profiles and ratings.' },
            { step: '3', icon: '🤝', title: 'Hire and connect', desc: 'Select the best worker. Pay a small connection fee to unlock their contact.' },
          ].map(item => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">{item.icon}</div>
              <h3 className="font-semibold text-earth-900 text-lg mb-2">{item.title}</h3>
              <p className="text-earth-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-y border-earth-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h2 className="section-title mb-2">Popular job types</h2>
          <p className="text-earth-500 mb-8">What do you need help with today?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/jobs?category=${cat.slug}`}
                className="flex items-center gap-3 p-4 rounded-xl border border-earth-100 hover:border-brand-300 hover:bg-brand-50 transition-all group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium text-earth-700 group-hover:text-brand-700 text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="section-title mb-4">Why trust matters</h2>
            <p className="text-earth-600 mb-6 leading-relaxed">
              Every worker on Daily Helper can apply for a <strong>Trusted Badge</strong> — verified by submitting their national ID and a one-time verification fee. Trusted workers stand out and get hired faster.
            </p>
            <ul className="space-y-4">
              {[
                { icon: '🪪', text: 'Identity verified by admin review' },
                { icon: '⭐', text: 'Rated by real customers after every job' },
                { icon: '📞', text: 'Phone unlocked only after payment confirmation' },
                { icon: '🔒', text: 'Your contact details stay private' },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-earth-700">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup?role=worker" className="btn-primary mt-8 inline-flex">
              Join as a Worker
            </Link>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-earth-700 text-sm uppercase tracking-wide">Trusted Workers</h3>
            {trustedWorkers.length === 0 ? (
              <p className="text-earth-400 text-sm">No trusted workers yet</p>
            ) : (
              trustedWorkers.map(w => (
                <Link key={w.id} href={`/workers/${w.userId}`} className="card flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-xl font-bold text-brand-600">
                    {w.user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-earth-900">{w.user.name}</span>
                      <span className="trusted-badge">✓ Trusted</span>
                    </div>
                    <div className="text-sm text-earth-500 truncate">{w.servicesOffered.slice(0, 2).join(', ')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-600 font-bold">⭐ {w.averageRating || '—'}</div>
                    <div className="text-xs text-earth-400">{w.jobsCompleted} jobs</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent jobs */}
      <section className="bg-earth-50 border-t border-earth-100">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Open jobs near you</h2>
            <Link href="/jobs" className="text-brand-600 font-medium hover:underline text-sm">View all →</Link>
          </div>
          {recentJobs.length === 0 ? (
            <p className="text-earth-500 text-center py-8">No open jobs yet. <Link href="/signup" className="text-brand-600">Be the first to post!</Link></p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {recentJobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
          <div className="text-center mt-8">
            <Link href={session?.role === 'CUSTOMER' ? '/dashboard/customer/jobs/new' : '/signup'} className="btn-primary">
              Post Your Job Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
