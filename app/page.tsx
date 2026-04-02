import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/marketing/HeroSection'
import { LandingSections } from '@/components/marketing/LandingSections'

export interface PlatformStats {
  verifiedWorkers: number
  completedJobs: number
  avgRating: number | null
}

export default async function HomePage() {
  const session = await getServerSession()

  const [verifiedWorkers, completedJobs, ratingAgg] = await Promise.all([
    prisma.workerProfile.count({ where: { trustedBadge: true } }),
    prisma.job.count({ where: { status: 'COMPLETED' } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
  ])

  const stats: PlatformStats = {
    verifiedWorkers,
    completedJobs,
    avgRating: ratingAgg._avg.rating,
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-earth-900">
      <Navbar user={session} />
      <HeroSection session={session} stats={stats} />
      <LandingSections session={session} stats={stats} />
      <Footer />
    </div>
  )
}
