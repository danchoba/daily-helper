'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  X,
} from 'lucide-react'

type Role = 'CUSTOMER' | 'WORKER' | 'ADMIN'

interface Step {
  icon: React.ReactNode
  accent: string       // Tailwind gradient classes
  kicker: string
  title: string
  body: string
  tip?: string
}

const WORKER_STEPS: Step[] = [
  {
    icon: <Sparkles size={28} />,
    accent: 'from-brand-500 to-brand-700',
    kicker: 'Welcome to Daily Helper',
    title: "Botswana's local gig marketplace",
    body: "You're joining a platform that connects real workers with customers who need help — cleaning, gardening, moving, plumbing, and more. Let's get you set up in 3 quick steps.",
    tip: undefined,
  },
  {
    icon: <UserRound size={28} />,
    accent: 'from-sage-500 to-sage-700',
    kicker: 'Step 1 — Your profile',
    title: 'Make a strong first impression',
    body: 'Customers browse worker profiles before deciding who to contact. A clear bio, your service area, and a list of services dramatically increase your chances of getting shortlisted.',
    tip: 'Workers with complete profiles are 3× more likely to be selected.',
  },
  {
    icon: <ShieldCheck size={28} />,
    accent: 'from-orange-500 to-accent-600',
    kicker: 'Step 2 — Get verified',
    title: 'Earn the Trusted badge',
    body: 'Submit a verification request and our team will review your profile. Once approved, a Trusted badge appears on your profile — which builds instant credibility with customers.',
    tip: 'Workers with a Trusted badge are significantly more likely to be selected.',
  },
  {
    icon: <BriefcaseBusiness size={28} />,
    accent: 'from-neon-blue to-brand-600',
    kicker: 'Step 3 — Start earning',
    title: 'Apply for jobs nearby',
    body: 'Browse open job listings, filter by category or area, and send a personalised application. When a customer selects you, they can see your contact details and reach out directly.',
    tip: undefined,
  },
]

const CUSTOMER_STEPS: Step[] = [
  {
    icon: <Sparkles size={28} />,
    accent: 'from-brand-500 to-brand-700',
    kicker: 'Welcome to Daily Helper',
    title: 'Trusted local help in Botswana',
    body: "Find reliable workers for cleaning, garden work, moving, plumbing, painting, and more. You post a job, workers apply, and you choose who to hire. Let's walk you through it.",
    tip: undefined,
  },
  {
    icon: <ClipboardList size={28} />,
    accent: 'from-sage-500 to-sage-700',
    kicker: 'Step 1 — Post a job',
    title: 'Describe what you need',
    body: 'Give your job a clear title, description, budget, and location. The more specific you are — the better quality applications you receive. Jobs automatically expire after 30 days if not filled.',
    tip: 'Tip: Jobs with budgets get significantly more applications.',
  },
  {
    icon: <MessageSquare size={28} />,
    accent: 'from-orange-500 to-accent-500',
    kicker: 'Step 2 — Review applicants',
    title: 'Browse worker profiles',
    body: "Workers send personalised messages when they apply. You can read each worker's bio, check their service area, see their rating, and look for the Trusted badge before deciding.",
    tip: undefined,
  },
  {
    icon: <Phone size={28} />,
    accent: 'from-neon-blue to-brand-600',
    kicker: 'Step 3 — Connect & complete',
    title: 'Contact your helper directly',
    body: "When you've found the right worker, select them and their phone number is revealed immediately. Reach out, coordinate the details, and get the job done.",
    tip: undefined,
  },
]

// Slide transition variants
const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

interface OnboardingModalProps {
  role: Role
  userName: string
}

export function OnboardingModal({ role, userName }: OnboardingModalProps) {
  const router = useRouter()
  const steps = role === 'WORKER' ? WORKER_STEPS : CUSTOMER_STEPS
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [dismissing, setDismissing] = useState(false)
  const [visible, setVisible] = useState(true)

  const firstName = userName.split(' ')[0]
  const isLast = step === steps.length - 1
  const current = steps[step]

  const markSeen = useCallback(async () => {
    try {
      await fetch('/api/user/onboarding-seen', { method: 'POST' })
    } catch {
      // Non-critical — silently ignore
    }
  }, [])

  const dismiss = useCallback(async () => {
    setDismissing(true)
    await markSeen()
    setVisible(false)
    router.refresh()
  }, [markSeen, router])

  const next = useCallback(async () => {
    if (isLast) {
      await dismiss()
    } else {
      setDirection(1)
      setStep(s => s + 1)
    }
  }, [isLast, dismiss])

  // Don't render at all once hidden
  if (!visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-earth-950/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Welcome to Daily Helper"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-earth-200/80 bg-white shadow-glass">

              {/* Dismiss button */}
              <button
                onClick={dismiss}
                disabled={dismissing}
                aria-label="Skip onboarding"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-xl text-earth-400 transition-colors hover:bg-earth-100 hover:text-earth-700"
              >
                <X size={16} />
              </button>

              {/* Progress bar */}
              <div className="h-1 w-full bg-earth-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-400"
                  initial={false}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              {/* Step content */}
              <div className="px-7 pb-7 pt-6">

                {/* Step counter */}
                <div className="mb-5 flex items-center gap-1.5">
                  {steps.map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        width: i === step ? 20 : 6,
                        backgroundColor: i <= step ? '#d97706' : '#e5e2d9',
                      }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="h-1.5 rounded-full"
                    />
                  ))}
                </div>

                {/* Animated step body */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {/* Icon */}
                    <div
                      className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm ${current.accent}`}
                    >
                      {current.icon}
                    </div>

                    {/* Personalised greeting on first step */}
                    {step === 0 && (
                      <p className="mb-1 text-sm font-bold text-brand-600">
                        Hey {firstName}! 👋
                      </p>
                    )}

                    <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-earth-400">
                      {current.kicker}
                    </p>

                    <h2 className="mb-3 text-xl font-black leading-snug tracking-tight text-earth-950">
                      {current.title}
                    </h2>

                    <p className="text-sm leading-relaxed text-earth-500">
                      {current.body}
                    </p>

                    {current.tip && (
                      <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3">
                        <Star size={13} className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true" />
                        <p className="text-xs leading-5 text-brand-800">{current.tip}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Actions */}
                <div className="mt-7 flex items-center justify-between gap-3">
                  <button
                    onClick={dismiss}
                    disabled={dismissing}
                    className="text-sm font-semibold text-earth-400 transition-colors hover:text-earth-600"
                  >
                    Skip for now
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={next}
                    disabled={dismissing}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-glow-sm transition-all hover:shadow-glow disabled:opacity-60"
                  >
                    {isLast ? (
                      <>
                        <CheckCircle2 size={15} aria-hidden="true" />
                        {role === 'WORKER' ? 'Browse jobs' : 'Post a job'}
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight size={15} aria-hidden="true" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Bottom role badge */}
              <div className="border-t border-earth-100 px-7 py-3">
                <div className="flex items-center gap-2 text-xs text-earth-400">
                  <BadgeCheck size={13} className="text-sage-500" aria-hidden="true" />
                  <span>
                    {role === 'WORKER'
                      ? 'You joined as a Worker — find jobs and earn locally'
                      : 'You joined as a Customer — hire trusted local help'}
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
