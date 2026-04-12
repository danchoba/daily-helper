'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Bell, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface Notification {
  id: string
  type: string
  title: string
  body: string
  link: string | null
  readAt: string | null
  createdAt: string
}

export function NotificationBadge() {
  const [count, setCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications ?? [])
        setCount(data.unreadCount ?? 0)
      }
    } catch {}
  }

  async function markAllRead() {
    try {
      await fetch('/api/notifications', { method: 'PATCH' })
      setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })))
      setCount(0)
    } catch {}
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 15_000)
    const onVisibility = () => { if (document.visibilityState === 'visible') fetchNotifications() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(v => !v); if (!open && count > 0) markAllRead() }}
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
        className="relative flex h-8 w-8 items-center justify-center rounded-xl text-earth-500 transition-colors hover:bg-earth-100 hover:text-earth-800"
      >
        <Bell size={16} />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-earth-100 px-4 py-3">
            <p className="text-sm font-bold text-earth-900">Notifications</p>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-earth-400 hover:bg-earth-100">
              <X size={14} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-earth-400">No notifications yet</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={cn(
                    'border-b border-earth-50 px-4 py-3 last:border-0',
                    !n.readAt && 'bg-brand-50/50',
                  )}
                >
                  {n.link ? (
                    <Link href={n.link} onClick={() => setOpen(false)} className="block">
                      <p className="text-sm font-semibold text-earth-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-earth-500">{n.body}</p>
                      <p className="mt-1 text-[10px] text-earth-400">{timeAgo(n.createdAt)}</p>
                    </Link>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-earth-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-earth-500">{n.body}</p>
                      <p className="mt-1 text-[10px] text-earth-400">{timeAgo(n.createdAt)}</p>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
