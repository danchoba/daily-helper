import { cn } from '@/lib/utils'
import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <input
          ref={ref}
          id={inputId}
          className={cn('input-field', error && 'border-red-400 focus:ring-red-400', className)}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-earth-400">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={cn('input-field resize-none', error && 'border-red-400 focus:ring-red-400', className)}
          {...props}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-earth-400">{hint}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

interface SelectProps {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function Select({ label, error, options, value, onChange, placeholder, disabled }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="label">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={cn('input-field', error && 'border-red-400')}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
