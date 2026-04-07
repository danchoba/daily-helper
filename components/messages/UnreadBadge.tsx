'use client'
import { useEffect, useState } from 'react'

export function UnreadBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    async function fetchCount() {
      if (document.visibilityState !== 'visible') return
      try {
        const res = await fetch('/api/messages/unread-count')
        if (res.ok) {
          const data = await res.json()
          setCount(data.unreadCount ?? 0)
        }
      } catch {}
    }

    fetchCount()
    const interval = setInterval(fetchCount, 10_000)
    const onVisibility = () => { if (document.visibilityState === 'visible') fetchCount() }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  if (count === 0) return null

  return (
    <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  )
}
