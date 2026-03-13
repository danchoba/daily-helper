'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (rating: number) => void
  readonly?: boolean
  size?: number
}

export function StarRating({ value, onChange, readonly = false, size = 20 }: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={cn('transition-transform', !readonly && 'hover:scale-110 cursor-pointer', readonly && 'cursor-default')}
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              star <= display ? 'text-amber-500 fill-amber-500' : 'text-earth-200'
            )}
          />
        </button>
      ))}
    </div>
  )
}
