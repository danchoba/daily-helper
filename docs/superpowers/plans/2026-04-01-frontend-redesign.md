# Frontend Redesign — "The Field" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the indigo + magenta "AI-generated" aesthetic with a warm amber + forest green "The Field" identity across the landing page, navbar, and all dashboards.

**Architecture:** All colour changes flow from a single source of truth — the Tailwind token remapping in `tailwind.config.ts`. Most components update automatically; only files with hardcoded hex values or structural CSS need manual edits. Five tasks in total, each independently committable.

**Tech Stack:** Next.js 14, Tailwind CSS v3, Framer Motion, Lucide icons, Manrope font.

---

## File Map

| File | Change type |
|------|-------------|
| `tailwind.config.ts` | Remap `brand` → amber, `sage` → forest green, `accent` → rose, `earth` → warm stone; update shadow RGB values |
| `app/globals.css` | Update hardcoded hex in body bg, focus ring, gradients, hero-grid |
| `components/marketing/HeroSection.tsx` | Update hardcoded bg, orb colour, animated word gradient, dot hex, particle/ring classes |
| `components/layout/DashboardFrame.tsx` | Remove `roleGradients`; replace gradient user card + mobile bar with flat dark header |
| `app/page.tsx` | Update hardcoded hex array for trust section worker avatars |

**Auto-updating after Task 1 (no manual edits needed):**
- `components/layout/Navbar.tsx` — all token-based
- `components/dashboard/StatCard.tsx` — all token-based
- `app/dashboard/customer/page.tsx` — all token-based
- `app/dashboard/worker/page.tsx` — all token-based
- `app/dashboard/admin/page.tsx` — all token-based

---

## Task 1: Remap Colour Tokens

**Files:**
- Modify: `tailwind.config.ts`

---

- [ ] **Step 1: Replace the full contents of `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        accent: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        neon: {
          teal:  '#34d399',
          blue:  '#38bdf8',
          green: '#4ade80',
          amber: '#f59e0b',
        },
        earth: {
          50:  '#faf9f6',
          100: '#f2f0eb',
          200: '#e5e2d9',
          300: '#ccc8bb',
          400: '#a09a8a',
          500: '#7a7365',
          600: '#5c564a',
          700: '#403c32',
          800: '#2a2620',
          900: '#1c1a14',
          950: '#0d0c09',
        },
        sage: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        success: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'gradient-x': 'gradient-x 8s ease infinite',
        'gradient-xy': 'gradient-xy 10s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'orbit': 'orbit 12s linear infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        },
      },
      backgroundSize: {
        '200%': '200%',
        '300%': '300%',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(217, 119, 6, 0.25)',
        'glow':    '0 0 40px rgba(217, 119, 6, 0.35)',
        'glow-lg': '0 0 80px rgba(217, 119, 6, 0.4)',
        'glow-teal': '0 0 40px rgba(22, 163, 74, 0.35)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
        'card':       '0 1px 3px rgba(13, 12, 9, 0.06), 0 6px 24px rgba(13, 12, 9, 0.05)',
        'card-hover': '0 4px 8px rgba(13, 12, 9, 0.06), 0 16px 48px rgba(13, 12, 9, 0.1)',
        'glass':      '0 8px 32px rgba(13, 12, 9, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 2: Start dev server and verify tokens are loading**

```bash
npm run dev
```

Navigate to `http://localhost:3000`. The navbar "Get Started" button and any `bg-brand-500` elements should now be **amber/gold** instead of indigo. The previously teal `sage-*` elements (trusted badge, verification icons) should now be **forest green**.

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: remap colour tokens — brand→amber, sage→forest green, earth→warm stone"
```

---

## Task 2: Update Global CSS

**Files:**
- Modify: `app/globals.css`

---

- [ ] **Step 1: Update body background colour**

Find and replace this line in `app/globals.css`:

```css
/* BEFORE */
  background: #fafafa;

/* AFTER */
  background: #faf9f6;
```

- [ ] **Step 2: Update focus ring colour**

```css
/* BEFORE */
  outline: 2px solid #4f46e5;

/* AFTER */
  outline: 2px solid #d97706;
```

- [ ] **Step 3: Update `.gradient-brand`**

```css
/* BEFORE */
  .gradient-brand {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
    background-size: 200% 200%;
  }

/* AFTER */
  .gradient-brand {
    background: linear-gradient(135deg, #d97706 0%, #b45309 50%, #92400e 100%);
    background-size: 200% 200%;
  }
```

- [ ] **Step 4: Update `.gradient-mesh`**

```css
/* BEFORE */
  .gradient-mesh {
    background:
      radial-gradient(at 40% 20%, rgba(79, 70, 229, 0.15) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(124, 58, 237, 0.1) 0px, transparent 50%),
      radial-gradient(at 0% 50%, rgba(20, 184, 166, 0.1) 0px, transparent 50%),
      radial-gradient(at 80% 50%, rgba(249, 115, 22, 0.05) 0px, transparent 50%),
      radial-gradient(at 0% 100%, rgba(79, 70, 229, 0.1) 0px, transparent 50%);
  }

/* AFTER */
  .gradient-mesh {
    background:
      radial-gradient(at 40% 20%, rgba(217, 119, 6, 0.12) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(180, 83, 9, 0.08) 0px, transparent 50%),
      radial-gradient(at 0% 50%, rgba(22, 163, 74, 0.08) 0px, transparent 50%),
      radial-gradient(at 80% 50%, rgba(245, 158, 11, 0.05) 0px, transparent 50%),
      radial-gradient(at 0% 100%, rgba(217, 119, 6, 0.08) 0px, transparent 50%);
  }
```

- [ ] **Step 5: Update `.hero-grid` line colour**

```css
/* BEFORE */
.hero-grid {
  background-image:
    linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 44px 44px;
}

/* AFTER */
.hero-grid {
  background-image:
    linear-gradient(rgba(251, 191, 36, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(251, 191, 36, 0.06) 1px, transparent 1px);
  background-size: 44px 44px;
}
```

- [ ] **Step 6: Update `.landing-aurora`**

```css
/* BEFORE */
.landing-aurora {
  background:
    radial-gradient(circle at 0% 0%, rgba(191, 219, 254, 0.5), transparent 28%),
    radial-gradient(circle at 100% 0%, rgba(204, 251, 241, 0.42), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(244, 248, 255, 0.98));
  animation: aurora-shift 18s ease-in-out infinite;
}

/* AFTER */
.landing-aurora {
  background:
    radial-gradient(circle at 0% 0%, rgba(253, 230, 138, 0.35), transparent 28%),
    radial-gradient(circle at 100% 0%, rgba(187, 247, 208, 0.28), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 251, 235, 0.98));
  animation: aurora-shift 18s ease-in-out infinite;
}
```

- [ ] **Step 7: Verify visually**

Navigate to `http://localhost:3000`. Check:
- Body background is warm off-white (not cold `#fafafa`)
- Focus ring on any input or button is amber
- `.kicker` text is amber (uses `text-brand-500` utility which now resolves to amber)

- [ ] **Step 8: Commit**

```bash
git add app/globals.css
git commit -m "feat: update global CSS — warm body bg, amber focus ring, warm gradient tokens"
```

---

## Task 3: Reskin Hero Section

**Files:**
- Modify: `components/marketing/HeroSection.tsx`

---

- [ ] **Step 1: Update hero background, orbs, particles, and rings**

Replace the entire `<section>` element's background class and the pointer-events-none block. Find the outer `<section>`:

```tsx
// BEFORE
<section
  ref={ref}
  className="relative min-h-[90vh] overflow-hidden bg-[#05061a]"
  aria-label="Hero"
>
```

```tsx
// AFTER
<section
  ref={ref}
  className="relative min-h-[90vh] overflow-hidden bg-[#0f0a03]"
  aria-label="Hero"
>
```

- [ ] **Step 2: Update animated gradient orbs**

Find the three `motion.div` orbs inside `{/* ── Animated gradient orbs ── */}`. Replace only the `className` values:

```tsx
// BEFORE — orb 1 (top-left, indigo)
className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-brand-600/30 blur-[120px]"

// AFTER — orb 1 (amber)
className="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-amber-600/25 blur-[120px]"
```

```tsx
// BEFORE — orb 2 (top-right, magenta/accent)
className="absolute -right-48 top-0 h-[500px] w-[500px] rounded-full bg-accent-600/25 blur-[100px]"

// AFTER — orb 2 (emerald)
className="absolute -right-48 top-0 h-[500px] w-[500px] rounded-full bg-emerald-700/20 blur-[100px]"
```

```tsx
// BEFORE — orb 3 (bottom, teal sage)
className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-sage-500/20 blur-[100px]"

// AFTER — orb 3 (warm amber)
className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-400/15 blur-[100px]"
```

- [ ] **Step 3: Update dot particles**

Find the 12 dot particles map. Replace:

```tsx
// BEFORE
className="absolute h-1.5 w-1.5 rounded-full bg-white/30"

// AFTER
className="absolute h-1.5 w-1.5 rounded-full bg-amber-200/20"
```

- [ ] **Step 4: Update spinning rings**

Find the two spinning ring `motion.div` elements. Replace their classes:

```tsx
// BEFORE — outer ring
className="absolute right-[5%] top-[10%] h-[280px] w-[280px] rounded-full border border-white/5"

// AFTER
className="absolute right-[5%] top-[10%] h-[280px] w-[280px] rounded-full border border-amber-800/10"
```

```tsx
// BEFORE — inner ring
className="absolute right-[8%] top-[13%] h-[200px] w-[200px] rounded-full border border-brand-400/10"

// AFTER
className="absolute right-[8%] top-[13%] h-[200px] w-[200px] rounded-full border border-amber-600/8"
```

- [ ] **Step 5: Update AnimatedWord gradient**

Find the `AnimatedWord` function. Replace:

```tsx
// BEFORE
className="block bg-gradient-to-r from-neon-teal via-neon-blue to-accent-400 bg-clip-text text-transparent"

// AFTER
className="block bg-gradient-to-r from-amber-300 via-amber-400 to-emerald-400 bg-clip-text text-transparent"
```

- [ ] **Step 6: Update FloatingJobCard dot inline style hex values**

In `FloatingJobCard`, find the `style` attribute on the pulsing dot `<span>`:

```tsx
// BEFORE
style={{ background: card.dot.replace('bg-', '').includes('brand') ? '#4f46e5' : card.dot.replace('bg-', '').includes('sage') ? '#14b8a6' : '#d946ef' }}

// AFTER
style={{ background: card.dot.replace('bg-', '').includes('brand') ? '#f59e0b' : card.dot.replace('bg-', '').includes('sage') ? '#22c55e' : '#f43f5e' }}
```

- [ ] **Step 7: Update floating card glass → warm opaque style**

In `FloatingJobCard`, find the inner `motion.div` that uses the card accent:

```tsx
// BEFORE
className={`rounded-2xl border bg-gradient-to-br p-4 shadow-glass backdrop-blur-sm ${card.accent}`}

// AFTER
className={`rounded-2xl border bg-gradient-to-br p-4 shadow-card ${card.accent}`}
```

(Removes `backdrop-blur-sm` and swaps `shadow-glass` for `shadow-card` — less glassy, more solid.)

- [ ] **Step 8: Update Active jobs stat pill**

Find the `{/* Stat pill */}` motion.div:

```tsx
// BEFORE
className="absolute right-[8%] top-[15%] rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"

// AFTER
className="absolute right-[8%] top-[15%] rounded-2xl border border-amber-900/50 bg-amber-950/60 px-4 py-3 backdrop-blur"
```

- [ ] **Step 9: Update scroll hint mouse icon**

```tsx
// BEFORE
className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 pt-2"
// dot:
className="h-1.5 w-1 rounded-full bg-white/40"

// AFTER
className="flex h-10 w-6 items-start justify-center rounded-full border border-amber-700/30 pt-2"
// dot:
className="h-1.5 w-1 rounded-full bg-amber-300/40"
```

- [ ] **Step 10: Verify hero visually**

Navigate to `http://localhost:3000`. Check:
- Hero background is warm near-black (not cold blue-black)
- The three animated orbs are amber (left), emerald (right), warm amber (bottom)
- The animated word cycles through amber-to-green gradient text
- Floating job cards have warm opaque dark backs, no frost blur
- Spinning rings are barely visible amber tints
- The "Active jobs 240+" pill has an amber-dark warm background

- [ ] **Step 11: Commit**

```bash
git add components/marketing/HeroSection.tsx
git commit -m "feat: reskin hero — warm dark bg, amber/emerald orbs, warm floating cards"
```

---

## Task 4: Reskin Dashboard Frame

**Files:**
- Modify: `components/layout/DashboardFrame.tsx`

---

- [ ] **Step 1: Remove `roleGradients` constant and update `roleBadgeColors`**

Find and replace:

```tsx
// BEFORE
const roleGradients: Record<Role, string> = {
  CUSTOMER: 'from-brand-600 to-accent-600',
  WORKER: 'from-sage-600 to-brand-500',
  ADMIN: 'from-orange-500 to-accent-600',
}

const roleBadgeColors: Record<Role, string> = {
  CUSTOMER: 'border-brand-200 bg-brand-50 text-brand-700',
  WORKER: 'border-sage-200 bg-sage-50 text-sage-700',
  ADMIN: 'border-orange-200 bg-orange-50 text-orange-700',
}

// AFTER — remove roleGradients entirely, update roleBadgeColors
const roleBadgeColors: Record<Role, string> = {
  CUSTOMER: 'border-amber-200 bg-amber-50 text-amber-800',
  WORKER: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  ADMIN: 'border-stone-300 bg-stone-100 text-stone-700',
}
```

- [ ] **Step 2: Replace sidebar gradient user card with flat white header**

Find the `{/* Gradient user card */}` div inside the desktop sidebar:

```tsx
// BEFORE
{/* Gradient user card */}
<div className={`bg-gradient-to-br ${roleGradients[user.role]} p-4`}>
  <div className="flex items-center gap-3">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/25 text-sm font-black text-white shadow-sm backdrop-blur-sm"
    >
      {initial}
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      className="min-w-0"
    >
      <div className="truncate text-sm font-bold text-white">{user.name}</div>
      <div className="text-[11px] font-medium text-white/70">{roleLabels[user.role]}</div>
    </motion.div>
  </div>
</div>

// AFTER — flat white header, amber initial circle
{/* User card */}
<div className="border-b border-earth-100 p-4">
  <div className="flex items-center gap-3">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-black text-amber-800"
    >
      {initial}
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.35 }}
      className="min-w-0"
    >
      <div className="truncate text-sm font-bold text-earth-900">{user.name}</div>
      <div className="text-[11px] font-medium text-earth-500">{roleLabels[user.role]}</div>
    </motion.div>
  </div>
</div>
```

- [ ] **Step 3: Replace mobile gradient header bar with flat dark header**

Find the mobile `{/* ── Mobile header + tabs ── */}` section. Replace the gradient div:

```tsx
// BEFORE
<div className={`bg-gradient-to-r ${roleGradients[user.role]} px-4 py-3`}>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25 text-xs font-black text-white">
        {initial}
      </div>
      <span className="text-sm font-semibold text-white">{user.name}</span>
    </div>
    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
      {roleLabels[user.role]}
    </span>
  </div>
</div>

// AFTER — flat dark amber header
<div className="bg-[#1a0f02] px-4 py-3">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-800/40 text-xs font-black text-amber-200">
        {initial}
      </div>
      <span className="text-sm font-semibold text-white">{user.name}</span>
    </div>
    <span className="rounded-full bg-amber-700/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-200">
      {roleLabels[user.role]}
    </span>
  </div>
</div>
```

- [ ] **Step 4: Update dashboard background**

Find the outermost wrapper div:

```tsx
// BEFORE
<div className="min-h-screen bg-gradient-to-br from-earth-50 to-earth-100/60">

// AFTER
<div className="min-h-screen bg-[#faf9f6]">
```

- [ ] **Step 5: Verify dashboard visually**

Navigate to `http://localhost:3000/dashboard/customer` (log in first). Check:
- Sidebar user card: white background, amber initial circle, dark name text
- Sidebar active nav item: amber background + text (not indigo)
- Mobile header bar (resize to mobile): flat dark `#1a0f02` background, amber role badge
- Dashboard background: flat warm off-white (not gradient)
- Active sidebar dot: amber

- [ ] **Step 6: Commit**

```bash
git add components/layout/DashboardFrame.tsx
git commit -m "feat: reskin dashboard frame — remove role gradients, flat warm headers"
```

---

## Task 5: Fix Hardcoded Hex in Landing Page

**Files:**
- Modify: `app/page.tsx`

---

- [ ] **Step 1: Update trust section worker avatar colours**

In the Trust section, find the worker avatar loop. Replace the `style` background array:

```tsx
// BEFORE
style={{ background: ['#4f46e5', '#14b8a6', '#d946ef', '#f59e0b'][i] }}

// AFTER
style={{ background: ['#d97706', '#16a34a', '#f43f5e', '#b45309'][i] }}
```

(Amber, forest green, rose, dark amber — all four avatars now use the new palette.)

- [ ] **Step 2: Update How It Works bg decoration orbs**

Find the How It Works section. Replace:

```tsx
// BEFORE
<div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/20 blur-[80px]" />
<div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-accent-600/15 blur-[80px]" />

// AFTER
<div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-600/20 blur-[80px]" />
<div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-emerald-600/15 blur-[80px]" />
```

(The `bg-brand-600/20` would auto-update to amber via tokens, but `bg-accent-600/15` would become rose which looks wrong in this dark section — override it to emerald explicitly.)

- [ ] **Step 3: Update CTA banner bg decoration orbs**

Find the CTA banner section. Replace:

```tsx
// BEFORE
<div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-600/25 blur-[80px]" />
<div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-accent-600/20 blur-[80px]" />

// AFTER
<div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-amber-600/25 blur-[80px]" />
<div className="absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-emerald-600/20 blur-[80px]" />
```

- [ ] **Step 4: Update Trust section decoration blobs**

Find the trust section visual panel:

```tsx
// BEFORE
<div className="absolute -left-8 -top-8 h-48 w-48 rounded-full bg-brand-500/10 blur-3xl" />
<div className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-sage-500/10 blur-3xl" />

// AFTER — brand auto-updates; sage auto-updates; these are already fine via tokens
// No change needed for these two — both use token-based classes.
```

- [ ] **Step 5: Update Trust dark panel kicker colour**

Find the dark panel inside the trust section. Replace:

```tsx
// BEFORE
<span className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Platform principle</span>

// AFTER — auto-updates via brand token; no change needed
```

- [ ] **Step 6: Verify landing page visually**

Navigate to `http://localhost:3000`. Check:
- Stats strip: `BriefcaseBusiness` icon is amber, `ShieldCheck` is forest green, `Star` is amber
- Features section: feature cards use amber/green/rose/orange icon backgrounds
- How It Works: dark section has amber top-right orb and emerald bottom-left orb
- Categories: category cards use amber/green icon colours on hover
- Trust section: worker avatar circle colours are amber/green/rose/dark-amber
- CTA banner: amber + emerald orbs visible in background
- All `text-gradient` headings (`not just any gig platform`, `every single week`, etc.) use amber-to-rose gradient
- `text-gradient-teal` headings (`not casual`) use forest-green-to-amber gradient
- CTA primary button is amber

- [ ] **Step 7: Final full-site visual pass**

Visit these routes and confirm no leftover indigo or magenta:
- `http://localhost:3000` — landing page
- `http://localhost:3000/jobs` — jobs listing (uses card components)
- `http://localhost:3000/dashboard/customer` — customer dashboard
- `http://localhost:3000/dashboard/worker` — worker dashboard
- `http://localhost:3000/dashboard/admin` — admin dashboard (if available)

Any remaining indigo/magenta is a missed hardcoded hex — locate it with:

```bash
grep -r "#4f46e5\|#7c3aed\|#db2777\|#d946ef\|#c026d3" --include="*.tsx" --include="*.css" .
```

Expected output: no matches.

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx
git commit -m "feat: fix hardcoded hex in landing page — amber/green/rose palette"
```

---

## Self-Review Notes

1. **Spec coverage check:**
   - Section 1 (colour tokens): Task 1 + 2 ✓
   - Section 2 (hero): Task 3 ✓
   - Section 3 (navbar): auto-updates from Task 1 ✓
   - Section 4 (landing sections): Task 5 ✓ (features/how-it-works/categories/trust/cta)
   - Section 5 (dashboard): Task 4 (DashboardFrame) + auto-updates from Task 1 ✓

2. **All dashboard pages** (customer, worker, admin, StatCard): auto-update from Task 1 — no manual tasks needed.

3. **Type consistency**: No types or interfaces are changed. All edits are className string replacements.

4. **Verification step 7** in Task 5 includes a grep command to catch any missed hardcoded hex — acts as a final correctness check.
