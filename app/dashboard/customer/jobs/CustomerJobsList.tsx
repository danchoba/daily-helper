'use client'
import { useState } from 'react'
import Link from 'next/link'
import { JobCard } from '@/components/jobs/JobCard'
import { JobTabs } from '@/components/jobs/JobTabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { SquareStack } from 'lucide-react'

type Status = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'CLOSED'

interface Job {
  id: string
  title: string
  description: string
  area: string
  budget?: number | null
  urgency: string
  status: string
  createdAt: Date | string
  category: { name: string; icon?: string | null }
  customer: { name: string }
  _count: { applications: number }
}

interface CustomerJobsListProps {
  jobs: Job[]
}

const TAB_STATUSES: Record<string, Status[] | null> = {
  ALL: null,
  OPEN: ['OPEN'],
  IN_PROGRESS: ['IN_PROGRESS'],
  COMPLETED: ['COMPLETED'],
  CANCELLED: ['CANCELLED', 'CLOSED'],
}

export function CustomerJobsList({ jobs }: CustomerJobsListProps) {
  type TabKey = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  const [activeTab, setActiveTab] = useState<TabKey>('ALL')

  const countByStatus = (statuses: Status[] | null) =>
    statuses ? jobs.filter(j => statuses.includes(j.status as Status)).length : jobs.length

  const tabs = [
    { key: 'ALL' as const, label: 'All jobs', count: countByStatus(null) },
    { key: 'OPEN' as const, label: 'Open', count: countByStatus(['OPEN']) },
    { key: 'IN_PROGRESS' as const, label: 'In Progress', count: countByStatus(['IN_PROGRESS']) },
    { key: 'COMPLETED' as const, label: 'Completed', count: countByStatus(['COMPLETED']) },
    { key: 'CANCELLED' as const, label: 'Cancelled', count: countByStatus(['CANCELLED', 'CLOSED']) },
  ]

  const filteredJobs = TAB_STATUSES[activeTab]
    ? jobs.filter(j => TAB_STATUSES[activeTab]!.includes(j.status as Status))
    : jobs

  return (
    <>
      <JobTabs activeTab={activeTab} tabs={tabs} onChange={setActiveTab} />

      {filteredJobs.length === 0 ? (
        <EmptyState
          icon={<SquareStack size={22} />}
          title={activeTab === 'ALL' ? 'No jobs posted yet' : `No ${activeTab.toLowerCase().replace('_', ' ')} jobs`}
          description={
            activeTab === 'ALL'
              ? 'Create your first job to start receiving applications from local workers.'
              : 'Jobs in this status will appear here.'
          }
          action={
            activeTab === 'ALL' ? (
              <Link href="/dashboard/customer/jobs/new" className="btn-primary">Post a job</Link>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs.map(job => (
            <div key={job.id} className="space-y-3">
              <JobCard job={job} showStatus />
              <div className="flex gap-3">
                <Link href={`/dashboard/customer/jobs/${job.id}/applicants`} className="btn-outline flex-1 text-center">
                  Applicants ({job._count.applications})
                </Link>
                <Link href={`/dashboard/customer/jobs/${job.id}/edit`} className="btn-outline">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
