import { cn } from '@/lib/cn'

interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  type?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

const variantMap = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-success-50 border-success-200 text-success-800',
  warning: 'bg-brand-50 border-brand-200 text-brand-800',
  error: 'bg-red-50 border-red-200 text-red-800',
}

export function Alert({ children, variant = 'info', type, className }: AlertProps) {
  const resolvedVariant = type ?? variant

  return (
    <div className={cn('rounded-xl border p-4 text-sm', variantMap[resolvedVariant], className)}>
      {children}
    </div>
  )
}

export default Alert
