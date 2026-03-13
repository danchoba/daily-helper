import { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="surface-card flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-earth-100 text-earth-600">
        {icon ?? <Inbox size={24} />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-earth-900">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm leading-6 text-earth-500">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
