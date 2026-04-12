'use client'
import { useEffect, useState } from 'react'
import { X, Download, Share } from 'lucide-react'
import { DailyHelperIcon } from '@/components/ui/DailyHelperIcon'

const DISMISS_KEY = 'dh_install_dismissed'
const DISMISS_DAYS = 14

function wasDismissedRecently() {
  try {
    const ts = localStorage.getItem(DISMISS_KEY)
    if (!ts) return false
    return Date.now() - parseInt(ts) < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch { return false }
}

function isAlreadyInstalled() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  )
}

function detectPlatform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

export function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)

  useEffect(() => {
    if (isAlreadyInstalled() || wasDismissedRecently()) return

    const p = detectPlatform()
    setPlatform(p)

    if (p === 'ios') {
      // iOS has no install event — show tip after a delay
      const t = setTimeout(() => setShow(true), 5000)
      return () => clearTimeout(t)
    }

    if (p === 'android') {
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setTimeout(() => setShow(true), 5000)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch { /* */ }
    setShow(false)
  }

  async function install() {
    if (!deferredPrompt) return
    const prompt = deferredPrompt as Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> }
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setShow(false)
    setDeferredPrompt(null)
  }

  if (!show) return null

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[60] md:hidden"
      role="dialog"
      aria-label="Install Daily Helper app"
    >
      <div className="relative overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-[0_8px_40px_rgba(13,12,9,0.18)]">
        {/* Amber accent stripe */}
        <div className="h-0.5 w-full bg-gradient-to-r from-brand-500 via-amber-400 to-brand-600" />

        <div className="p-4">
          {/* Dismiss */}
          <button
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-earth-400 transition-colors hover:bg-earth-100 hover:text-earth-700"
          >
            <X size={16} />
          </button>

          {/* App identity */}
          <div className="mb-3 flex items-center gap-3 pr-8">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
              <DailyHelperIcon className="relative h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-earth-950">Daily Helper</p>
              <p className="text-xs text-earth-500">Get help. Get hired.</p>
            </div>
          </div>

          {platform === 'ios' ? (
            <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2.5 text-sm text-earth-700 leading-relaxed">
              Tap{' '}
              <Share size={13} className="inline-block align-middle text-brand-600" aria-hidden="true" />{' '}
              <strong>Share</strong> then{' '}
              <strong>"Add to Home Screen"</strong>{' '}
              to install Daily Helper.
            </div>
          ) : (
            <button
              onClick={install}
              className="btn-primary w-full"
            >
              <Download size={15} aria-hidden="true" />
              Add to Home Screen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
