'use client'
import { cn } from '@/lib/utils'

type TabKey = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

interface Tab {
  key: TabKey
  label: string
  count: number
}

interface JobTabsProps {
  activeTab: TabKey
  tabs: Tab[]
  onChange: (tab: TabKey) => void
}

export function JobTabs({ activeTab, tabs, onChange }: JobTabsProps) {
  return (
    <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-earth-200 bg-earth-50 p-1.5" role="tablist" aria-label="Filter jobs by status">
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150',
            activeTab === tab.key
              ? 'bg-white text-earth-900 shadow-sm'
              : 'text-earth-500 hover:text-earth-800',
          )}
        >
          {tab.label}
          {tab.count > 0 && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                activeTab === tab.key
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-earth-200 text-earth-600',
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
