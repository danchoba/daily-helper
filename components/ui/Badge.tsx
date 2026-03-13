import { cn } from '@/lib/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'trusted' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  className?: string
}

const variantMap: Record<string, string> = {
  default: 'bg-earth-100 text-earth-700',
  trusted: 'bg-sage-100 text-sage-800',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-700',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', variantMap[variant], className)}>
      {children}
    </span>
  )
}

export function TrustedBadge({ children = 'Trusted' }: { children?: React.ReactNode }) {
  return <Badge variant="trusted">{children}</Badge>
}

export function JobStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase()
  const variant =
    normalizedStatus === 'OPEN'
      ? 'success'
      : normalizedStatus === 'IN_PROGRESS'
        ? 'warning'
        : normalizedStatus === 'COMPLETED'
          ? 'info'
          : normalizedStatus === 'CANCELLED'
            ? 'danger'
            : 'neutral'

  return <Badge variant={variant}>{normalizedStatus.replace(/_/g, ' ')}</Badge>
}
