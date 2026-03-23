'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
})

export function useToast() {
  return useContext(ToastContext)
}

const DURATION = 4500

function ToastCard({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const [exiting, setExiting] = useState(false)

  const dismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onRemove(item.id), 280)
  }, [item.id, onRemove])

  useEffect(() => {
    const t = setTimeout(dismiss, DURATION)
    return () => clearTimeout(t)
  }, [dismiss])

  const icons = {
    success: <CheckCircle2 size={16} className="shrink-0 text-success-600" />,
    error: <AlertCircle size={16} className="shrink-0 text-red-600" />,
    info: <Info size={16} className="shrink-0 text-brand-500" />,
  }

  const styles = {
    success: 'border-success-200 bg-white text-success-900',
    error: 'border-red-200 bg-white text-red-900',
    info: 'border-brand-200 bg-white text-brand-900',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'pointer-events-auto flex min-w-[300px] max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg transition-all duration-300',
        styles[item.type],
        exiting ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100',
      )}
    >
      {icons[item.type]}
      <p className="flex-1 text-sm font-medium leading-5">{item.message}</p>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-md p-0.5 text-earth-400 transition-colors hover:text-earth-700"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const add = useCallback((message: string, type: ToastType) => {
    const id = String(++idRef.current)
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const ctx: ToastContextValue = {
    success: msg => add(msg, 'success'),
    error: msg => add(msg, 'error'),
    info: msg => add(msg, 'info'),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[200] flex flex-col items-end gap-2"
      >
        {toasts.map(t => (
          <ToastCard key={t.id} item={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
