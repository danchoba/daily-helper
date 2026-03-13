'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
}

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => setFilter('category', '')}
        className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
          !currentCategory
            ? 'border-earth-900 bg-earth-900 text-white'
            : 'border-earth-200 bg-white text-earth-700 hover:border-earth-300 hover:bg-earth-50'
        }`}
      >
        All categories
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => setFilter('category', cat.slug)}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
            currentCategory === cat.slug
              ? 'border-earth-900 bg-earth-900 text-white'
              : 'border-earth-200 bg-white text-earth-700 hover:border-earth-300 hover:bg-earth-50'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
