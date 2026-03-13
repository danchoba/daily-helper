import Navbar from './Navbar'
import type { SessionUser } from '@/types'

interface PublicLayoutProps {
  children: React.ReactNode
  user?: SessionUser | null
}

export default function PublicLayout({ children, user }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p className="font-semibold text-white mb-2">Daily Helper</p>
          <p>Connecting Botswana with trusted local help.</p>
          <p className="mt-4">© {new Date().getFullYear()} Daily Helper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
