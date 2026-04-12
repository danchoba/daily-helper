import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
  basePath: string
  searchParams: Record<string, string | string[] | undefined>
}

function buildUrl(
  basePath: string,
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page' || !value) continue
    params.set(key, Array.isArray(value) ? value[0] : value)
  }
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

function getPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
}

export function Pagination({ total, pageSize, currentPage, basePath, searchParams }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pages = getPages(currentPage, totalPages)

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={buildUrl(basePath, searchParams, currentPage - 1)}
        aria-disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(
          'inline-flex items-center gap-1 rounded-xl border border-earth-200 bg-white px-3 py-2 text-sm font-semibold text-earth-700 transition-colors hover:bg-earth-50',
          currentPage === 1 && 'pointer-events-none opacity-40',
        )}
      >
        <ChevronLeft size={15} aria-hidden="true" />
        Prev
      </Link>

      {pages.map((page, i) =>
        page === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-earth-400" aria-hidden="true">…</span>
        ) : (
          <Link
            key={page}
            href={buildUrl(basePath, searchParams, page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition-colors',
              page === currentPage
                ? 'border-earth-900 bg-earth-900 text-white'
                : 'border-earth-200 bg-white text-earth-700 hover:bg-earth-50',
            )}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href={buildUrl(basePath, searchParams, currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        aria-label="Next page"
        className={cn(
          'inline-flex items-center gap-1 rounded-xl border border-earth-200 bg-white px-3 py-2 text-sm font-semibold text-earth-700 transition-colors hover:bg-earth-50',
          currentPage === totalPages && 'pointer-events-none opacity-40',
        )}
      >
        Next
        <ChevronRight size={15} aria-hidden="true" />
      </Link>
    </nav>
  )
}
