import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Daily Helper - Trusted Local Help in Botswana',
  description: 'Book trusted local help for cleaning, garden work, moving, plumbing, and more. Botswana\'s micro-gig marketplace.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#ef9610',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#faf9f7]">{children}</body>
    </html>
  )
}
