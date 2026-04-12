/**
 * Daily Helper logo mark.
 *
 * Concept: a minimal human figure whose body and arms naturally
 * form a checkmark — "helper" + "task done / trust" in one mark.
 *
 * Composition (top → bottom):
 *   ● Head  (filled circle, positioned above the checkmark elbow)
 *   | Neck  (short connector stroke)
 *   ✓ Body  (thick rounded checkmark = arms/torso of the figure)
 *
 * Uses currentColor — wrap in a coloured container for branding.
 * Renders cleanly from 16 px up to any size.
 */
export function DailyHelperIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Head */}
      <circle cx="10.5" cy="4.5" r="3.2" fill="currentColor" />

      {/* Neck */}
      <line
        x1="10.5" y1="7.7"
        x2="10.5" y2="10.5"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />

      {/* Body / arms → reads as a checkmark */}
      <path
        d="M3 14.5 L10.5 21 L22 9.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
