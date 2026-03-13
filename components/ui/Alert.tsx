import { cn } from '@/lib/cn'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

const variantMap = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-sage-50 border-sage-200 text-sage-800',
  warning: 'bg-brand-50 border-brand-200 text-brand-800',
  error: 'bg-red-50 border-red-200 text-red-800',
}

export function Alert({ children, variant = 'info', className }: AlertProps) {
  return (
    <div className={cn('rounded-xl border p-4 text-sm', variantMap[variant], className)}>
      {children}
    </div>
  )
}
