export { cn } from './cn'

export function formatBWP(amount: number | null | undefined): string {
  if (amount == null) return 'Negotiable'
  return `BWP ${amount.toFixed(0)}`
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Not specified'
  return new Date(date).toLocaleDateString('en-BW', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export const formatRelativeTime = timeAgo

export function urgencyLabel(urgency: string): string {
  const map: Record<string, string> = {
    LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent'
  }
  return map[urgency] || urgency
}

export function urgencyColor(urgency: string): string {
  const map: Record<string, string> = {
    LOW: 'bg-success-100 text-success-800',
    MEDIUM: 'bg-brand-100 text-brand-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  }
  return map[urgency] || 'bg-gray-100 text-gray-800'
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    OPEN: 'bg-success-100 text-success-800',
    IN_PROGRESS: 'bg-brand-100 text-brand-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800',
    CLOSED: 'bg-gray-100 text-gray-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-success-100 text-success-800',
    REJECTED: 'bg-red-100 text-red-800',
    SELECTED: 'bg-blue-100 text-blue-800',
    WITHDRAWN: 'bg-gray-100 text-gray-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}

export function appStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'Pending', SELECTED: 'Selected', REJECTED: 'Rejected', WITHDRAWN: 'Withdrawn'
  }
  return map[status] || status
}

export function jobStatusLabel(status: string): string {
  const map: Record<string, string> = {
    OPEN: 'Open', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed',
    CANCELLED: 'Cancelled', CLOSED: 'Closed'
  }
  return map[status] || status
}
