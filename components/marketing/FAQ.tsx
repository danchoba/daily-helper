'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

const FAQS = [
  {
    q: 'How do I post a job?',
    a: 'Sign up as a customer, then click "Post a Job" from your dashboard. Fill in the job details, location, budget, and timing. Your listing goes live immediately for local workers to see and apply.',
  },
  {
    q: 'Is there a verification process?',
    a: 'Yes. Workers can apply for a Trusted badge by submitting a verification request. An admin reviews each submission before approving. Verified workers are highlighted across the platform.',
  },
  {
    q: 'How do I contact a worker?',
    a: "Once you've reviewed applicants and selected the right worker, their phone number is revealed immediately. You can then reach out directly to coordinate the job.",
  },
  {
    q: 'Is Daily Helper free to join?',
    a: 'Yes — signing up is completely free for both customers and workers. Post jobs, browse helpers, and connect with no fees.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-earth-100 bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-earth-900 transition-colors hover:bg-earth-50"
            aria-expanded={open === i}
          >
            <span>{faq.q}</span>
            <ChevronDown
              size={18}
              className={cn(
                'shrink-0 text-earth-400 transition-transform duration-200',
                open === i && 'rotate-180',
              )}
            />
          </button>
          {open === i && (
            <div className="border-t border-earth-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-earth-500">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
