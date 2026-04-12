import Link from 'next/link'
import { WifiOff } from 'lucide-react'
import { DailyHelperIcon } from '@/components/ui/DailyHelperIcon'

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] px-4 text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
        <DailyHelperIcon className="relative h-9 w-9 text-white" />
      </div>

      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-earth-100 text-earth-400">
        <WifiOff size={20} />
      </div>

      <h1 className="mb-2 text-xl font-bold tracking-tight text-earth-950">You&apos;re offline</h1>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-earth-500">
        Check your connection and try again. Daily Helper needs the internet to load jobs and profiles.
      </p>

      <Link href="/" className="btn-primary">
        Try again
      </Link>
    </div>
  )
}
