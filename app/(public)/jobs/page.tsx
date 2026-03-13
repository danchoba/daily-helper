'use client'
import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Briefcase } from 'lucide-react'

interface Category { id: string; name: string; slug: string }

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [area, setArea] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (area) params.set('area', area)
    fetch(`/api/jobs?${params}`).then(r => r.json()).then(data => {
      setJobs(data)
      setLoading(false)
    })
  }, [selectedCategory, area])

  const filtered = jobs.filter(j =>
    !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.area.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-earth-900 mb-1">Browse Open Jobs</h1>
        <p className="text-earth-500 text-sm">Find gigs in your area</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="input-field text-sm">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <div className="relative">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
            <input
              type="text"
              placeholder="Area / Location"
              value={area}
              onChange={e => setArea(e.target.value)}
              className="input-field pl-8 text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="card h-36 animate-pulse bg-earth-100" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No jobs found" description="Try adjusting your filters or check back soon." />
      ) : (
        <>
          <p className="text-sm text-earth-500 mb-4">{filtered.length} job{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </>
      )}
    </div>
  )
}
