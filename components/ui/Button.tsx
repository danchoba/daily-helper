import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all active:scale-95',
    }
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: '',
      lg: 'px-6 py-4 text-lg',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(variants[variant], sizes[size], 'flex items-center justify-center gap-2', className)}
        {...props}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
