'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Filter, Loader2, MapPin, Navigation, Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

async function detectCity(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&accept-language=en`,
            { headers: { 'User-Agent': 'DailyHelper/1.0 (hello@dailyhelper.bw)' } }
          )
          const data = await res.json()
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.village ||
            null
          resolve(city)
        } catch { resolve(null) }
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: 300_000 }
    )
  })
}

interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
}

interface JobFiltersClientProps {
  categories: Category[]
  totalJobs: number
  basePath?: string
}

const SORT_OPTIONS = [
  { value: 'urgency', label: 'Most Urgent' },
  { value: 'newest', label: 'Newest First' },
  { value: 'budget_high', label: 'Budget: High → Low' },
  { value: 'budget_low', label: 'Budget: Low → High' },
]

export function JobFiltersClient({ categories, totalJobs, basePath = '/jobs' }: JobFiltersClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''
  const currentArea = searchParams.get('area') || ''
  const currentSort = searchParams.get('sort') || 'urgency'
  const currentQ = searchParams.get('q') || ''

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [areaInput, setAreaInput] = useState(currentArea)
  const [qInput, setQInput] = useState(currentQ)
  const [locating, setLocating] = useState(false)

  async function useMyLocation() {
    setLocating(true)
    try {
      const city = await detectCity()
      if (city) {
        setAreaInput(city)
        applyParams({ area: city })
      }
    } finally {
      setLocating(false)
    }
  }

  const applyParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v)
        else params.delete(k)
      }
      router.push(`${basePath}?${params.toString()}`)
    },
    [router, searchParams, basePath],
  )

  const setCategory = (slug: string) => applyParams({ category: slug })
  const setSort = (sort: string) => applyParams({ sort })
  const applyArea = () => applyParams({ area: areaInput })
  const applyQ = () => applyParams({ q: qInput })
  const clearAll = () => {
    setAreaInput('')
    setQInput('')
    router.push(basePath)
  }

  const hasActiveFilters = currentCategory || currentArea || currentQ

  return (
    <>
      {/* ── Desktop filter bar ── */}
      <div className="surface-card mb-6 p-4 md:p-5">
        {/* Top row: count + sort */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-earth-900">
              {totalJobs} open job{totalJobs === 1 ? '' : 's'}
            </div>
            <div className="text-sm text-earth-500">
              {currentArea
                ? `Filtered by area: ${currentArea}`
                : currentCategory
                  ? `Filtered by category`
                  : 'Filter by category and area to narrow results.'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-earth-500 transition-colors hover:bg-earth-100 hover:text-earth-800"
              >
                <X size={13} />
                Clear filters
              </button>
            )}
            {/* Sort select */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} className="shrink-0 text-earth-400" aria-hidden="true" />
              <select
                value={currentSort}
                onChange={e => setSort(e.target.value)}
                className="rounded-xl border border-earth-200 bg-white px-3 py-2 text-sm font-medium text-earth-800 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
                aria-label="Sort jobs"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
          <button
            onClick={() => setCategory('')}
            aria-pressed={!currentCategory}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors',
              !currentCategory
                ? 'border-earth-900 bg-earth-900 text-white'
                : 'border-earth-200 bg-white text-earth-700 hover:border-earth-300 hover:bg-earth-50',
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              aria-pressed={currentCategory === cat.slug}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors',
                currentCategory === cat.slug
                  ? 'border-earth-900 bg-earth-900 text-white'
                  : 'border-earth-200 bg-white text-earth-700 hover:border-earth-300 hover:bg-earth-50',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Keyword + area search — hidden on mobile (use bottom sheet instead) */}
        <div className="hidden gap-3 md:grid md:grid-cols-[1fr,1fr,auto,auto]">
          <label className="relative block">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" aria-hidden="true" />
            <input
              type="text"
              value={qInput}
              onChange={e => setQInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyQ()}
              placeholder="Search jobs by keyword…"
              className="input pl-10"
              aria-label="Search by keyword"
            />
          </label>
          <label className="relative block">
            <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" aria-hidden="true" />
            <input
              type="text"
              value={areaInput}
              onChange={e => setAreaInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyArea()}
              placeholder="Filter by area (e.g. Gaborone)"
              className="input pl-10"
              aria-label="Filter by area"
            />
          </label>
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            title="Use my location"
            aria-label="Detect my location"
            className="btn-outline shrink-0 px-3"
          >
            {locating
              ? <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              : <Navigation size={16} aria-hidden="true" />
            }
          </button>
          <button type="button" onClick={() => applyParams({ q: qInput, area: areaInput })} className="btn-outline">
            <Search size={16} aria-hidden="true" />
            Apply
          </button>
        </div>

        {/* Mobile: open bottom sheet button */}
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-earth-200 bg-earth-50 px-4 py-3 text-sm font-semibold text-earth-700 transition-colors hover:bg-earth-100 md:hidden"
          onClick={() => setBottomSheetOpen(true)}
          aria-expanded={bottomSheetOpen}
          aria-controls="filter-sheet"
        >
          <Filter size={15} aria-hidden="true" />
          {currentQ ? `"${currentQ}"` : currentArea ? `Area: ${currentArea}` : 'Search & filter'}
        </button>
      </div>

      {/* ── Mobile bottom sheet ── */}
      {bottomSheetOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter jobs by area"
          id="filter-sheet"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-earth-950/40 backdrop-blur-sm"
            onClick={() => setBottomSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-8 pt-4 shadow-2xl">
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-earth-200" aria-hidden="true" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-earth-950">Search & filter</h2>
              <button
                onClick={() => setBottomSheetOpen(false)}
                aria-label="Close filter panel"
                className="rounded-lg p-1.5 text-earth-500 hover:bg-earth-100"
              >
                <X size={18} />
              </button>
            </div>
            <label className="relative mb-3 block">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" aria-hidden="true" />
              <input
                type="text"
                value={qInput}
                onChange={e => setQInput(e.target.value)}
                placeholder="Search by keyword…"
                className="input pl-10"
                aria-label="Keyword search"
              />
            </label>
            <div className="mb-3 flex gap-2">
              <label className="relative block flex-1">
                <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-earth-400" aria-hidden="true" />
                <input
                  type="text"
                  value={areaInput}
                  onChange={e => setAreaInput(e.target.value)}
                  placeholder="e.g. Gaborone, Francistown"
                  className="input pl-10"
                  aria-label="Area"
                />
              </label>
              <button
                type="button"
                onClick={async () => {
                  const city = await (async () => { setLocating(true); try { return await detectCity() } finally { setLocating(false) } })()
                  if (city) setAreaInput(city)
                }}
                disabled={locating}
                title="Use my location"
                aria-label="Detect my location"
                className="btn-outline shrink-0 px-3"
              >
                {locating
                  ? <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  : <Navigation size={16} aria-hidden="true" />
                }
              </button>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { applyParams({ q: qInput, area: areaInput }); setBottomSheetOpen(false) }}
                className="btn-primary flex-1"
              >
                Apply filters
              </button>
              {(currentArea || currentQ) && (
                <button
                  type="button"
                  onClick={() => { setAreaInput(''); setQInput(''); applyParams({ area: '', q: '' }); setBottomSheetOpen(false) }}
                  className="btn-outline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
