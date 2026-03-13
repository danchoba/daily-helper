import Link from 'next/link'
import { ArrowRight, ShieldCheck, MapPin, Star, Zap, CheckCircle, Users, Briefcase } from 'lucide-react'
import prisma from '@/lib/db'
import { JobCard } from '@/components/jobs/JobCard'
import { WorkerCard } from '@/components/workers/WorkerCard'

async function getHomeData() {
  const [recentJobs, trustedWorkers, categories] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'open' },
      include: {
        category: true,
        customer: { include: { user: { select: { id: true, name: true } } } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.workerProfile.findMany({
      where: { trustedBadge: true },
      include: { user: { select: { id: true, name: true } } },
      take: 3,
    }),
    prisma.category.findMany(),
  ])
  return { recentJobs, trustedWorkers, categories }
}

export default async function HomePage() {
  const { recentJobs, trustedWorkers, categories } = await getHomeData()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-earth-900 via-earth-800 to-brand-900 text-white px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-200 text-sm font-medium px-3 py-1.5 rounded-full mb-6 border border-brand-500/30">
            <MapPin size={14} /> Botswana-first local gig platform
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Book trusted local help<br />
            <span className="text-brand-400">in minutes</span>
          </h1>
          <p className="text-earth-300 text-lg mb-8 max-w-lg mx-auto">
            Post a job, get applicants from your area, connect with verified workers for yard work, cleaning, moving, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn-primary text-base py-4 px-8 flex items-center justify-center gap-2">
              Post a Job <ArrowRight size={18} />
            </Link>
            <Link href="/signup?role=worker" className="btn-secondary text-base py-4 px-8 text-earth-900">
              Find Work
            </Link>
          </div>
          <div className="flex gap-6 justify-center mt-10 text-sm text-earth-400">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-brand-400" />Free to post</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-brand-400" />Verified workers</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-brand-400" />Pay only to connect</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-earth-100 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <Link key={cat.id} href={`/jobs?category=${cat.slug}`}
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-earth-50 hover:bg-brand-50 hover:text-brand-700 text-earth-700 text-sm font-medium transition-colors border border-earth-100">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-14 max-w-5xl mx-auto">
        <h2 className="font-display text-2xl font-bold text-earth-900 mb-2 text-center">How it works</h2>
        <p className="text-earth-500 text-center mb-10">Three simple steps to get the help you need</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', icon: <Briefcase size={24} />, title: 'Post your job', desc: 'Describe what you need, set your area and budget. Takes less than 2 minutes.' },
            { step: '2', icon: <Users size={24} />, title: 'Review applicants', desc: 'Workers in your area apply with a message. Browse their profiles and ratings.' },
            { step: '3', icon: <Zap size={24} />, title: 'Connect & get it done', desc: 'Pay a small connection fee to unlock the worker contact. Job done!' },
          ].map(item => (
            <div key={item.step} className="card p-6">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-4">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-brand-400 mb-2">STEP {item.step}</div>
              <h3 className="font-display font-bold text-earth-900 mb-2">{item.title}</h3>
              <p className="text-earth-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-forest-600 text-white px-4 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={28} className="text-green-300" />
                <h2 className="font-display text-2xl font-bold">Why trust matters</h2>
              </div>
              <p className="text-green-100 mb-4">
                Workers can earn a Trusted badge by verifying their identity with Daily Helper. This means you know who you are hiring.
              </p>
              <ul className="space-y-2 text-sm text-green-100">
                {['ID document verified', 'Phone number confirmed', 'Rated by past customers', 'Admin-reviewed profile'].map(item => (
                  <li key={item} className="flex items-center gap-2"><CheckCircle size={14} className="text-green-300" />{item}</li>
                ))}
              </ul>
            </div>
            {trustedWorkers.length > 0 && (
              <div className="md:w-1/2 w-full grid gap-3">
                {trustedWorkers.map(worker => (
                  <div key={worker.id} className="bg-white/10 backdrop-blur rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-white">{worker.user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{worker.user.name}</span>
                        <span className="badge-trusted text-xs">
                          <ShieldCheck size={10} />Trusted
                        </span>
                      </div>
                      {worker.area && <p className="text-green-200 text-xs">{worker.area}</p>}
                    </div>
                    {worker.averageRating > 0 && (
                      <div className="ml-auto flex items-center gap-1 text-amber-300 text-sm font-semibold">
                        <Star size={13} className="fill-amber-300" />{worker.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Open jobs preview */}
      {recentJobs.length > 0 && (
        <section className="px-4 py-14 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-2xl font-bold text-earth-900">Open Jobs Nearby</h2>
            <Link href="/jobs" className="btn-ghost text-sm">View all <ArrowRight size={14} className="inline" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recentJobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand-500 text-white px-4 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-brand-100 mb-8">Post your first job free, or create a worker profile and start earning today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors text-center">
              Post a Job — Free
            </Link>
            <Link href="/signup?role=worker" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-600 transition-colors text-center">
              I Want to Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
