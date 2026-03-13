'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category { id: string; name: string; slug: string; icon?: string | null }

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || ''
  const currentArea = searchParams.get('area') || ''

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => setFilter('category', '')}
        className={`badge cursor-pointer transition-all ${!currentCategory ? 'bg-brand-500 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => setFilter('category', cat.slug)}
          className={`badge cursor-pointer transition-all ${currentCategory === cat.slug ? 'bg-brand-500 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  )
}
