import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'

export const metadata: Metadata = {
  title: 'Daily Helper — Get help. Get hired.',
  description: 'Find trusted local help for cleaning, garden work, moving, plumbing, and more. Botswana\'s local job marketplace.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Daily Helper',
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: 'Daily Helper — Get help. Get hired.',
    description: 'Connect with trusted local workers across Botswana.',
    type: 'website',
    locale: 'en_BW',
  },
}

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[#faf9f7]">
        <ToastProvider>{children}</ToastProvider>
        <InstallPrompt />
      </body>
    </html>
  )
}
