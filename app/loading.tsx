import { Navbar } from '@/components/layout/Navbar'
import { PageSkeleton } from '@/components/ui/PageSkeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-earth-50">
      <Navbar user={null} />
      <div className="page-shell">
        <PageSkeleton cards={3} />
      </div>
    </div>
  )
}
