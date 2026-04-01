# Frontend Redesign — "The Field" — Design Spec
**Date:** 2026-04-01
**Status:** Approved

---

## Goal

Replace the current indigo + magenta "AI-generated" aesthetic with a warm, human, locally-rooted identity. The new identity — "The Field" — uses earthy amber and forest green as primary colours, feels approachable and trustworthy, and avoids glassmorphism, gradient user cards, and cold neon accents.

---

## Section 1 — Color System

### Tailwind token remapping (`tailwind.config.ts`)

| Old token | Purpose | New value |
|-----------|---------|-----------|
| `brand` | Primary interactive colour | Amber scale (`brand-50 #fffbeb` → `brand-600 #d97706` → `brand-900 #78350f`) |
| `accent` | Secondary / highlight | Warm rose `#e11d48` scale (used sparingly) |
| `sage` | Success / verification | Forest green scale (`sage-50 #f0fdf4` → `sage-600 #16a34a` → `sage-900 #14532d`) |
| `earth` | Neutrals (text, borders, backgrounds) | Warm stone/slate — unchanged in structure, warmer hue (`earth-50 #faf9f6`, `earth-900 #1c1a14`) |
| `neon-amber` | Highlight dot / star icon colour | `#f59e0b` (shift from cold `#fbbf24`) |

### Global CSS (`app/globals.css`)

- Base background: `#faf9f6` (warm off-white, replaces `#fafafa`)
- `--shadow-glow`: change from indigo `rgba(79,70,229,…)` to amber `rgba(217,119,6,…)`
- `--gradient-brand`: `linear-gradient(135deg, #d97706, #92400e)` (amber → dark amber)
- Remove any `neon-blue`, `neon-teal` gradient references from hero utility classes

---

## Section 2 — Hero Section (`components/marketing/HeroSection.tsx`)

### Background
Replace `bg-[#05061a]` (cold near-black) with `bg-[#0f0a03]` (warm near-black, slight amber cast).

### Animated orbs
Keep orbs and motion — re-colour only:

| Old class | New class |
|-----------|-----------|
| `bg-brand-600/30` (indigo) | `bg-amber-600/25` |
| `bg-accent-600/25` (magenta) | `bg-emerald-700/20` |
| `bg-sage-500/20` (teal) | `bg-amber-400/15` |

### AnimatedWord gradient
Replace `from-neon-teal via-neon-blue to-accent-400` with `from-amber-300 via-amber-400 to-emerald-400`.

### FloatingJobCard
- Remove glassmorphism card blur; use a semi-opaque warm card: `bg-[#1a1208]/90 border-amber-900/40`
- Category badge: `bg-amber-100/15 text-amber-200`
- Card accent colours: map brand → amber, sage → emerald, accent → rose

### Stat pills
- Active jobs pill: `bg-amber-900/40 border-amber-700/30` text white
- Trusted & Verified pill: `border-emerald-700/30 bg-emerald-900/20 text-emerald-300`

### Particle dots
Change `bg-white/30` → `bg-amber-200/20`

### Spinning rings
Change `border-white/5` → `border-amber-800/10` and `border-brand-400/10` → `border-amber-600/8`

### CTA buttons
- Primary: `bg-amber-500 hover:bg-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.4)]`
- Secondary: `border-amber-700/30 bg-amber-900/20 hover:bg-amber-900/35`

### Social proof icons
- ShieldCheck: `text-emerald-400` (was sage-400)
- Star: `text-amber-400` (was neon-amber)
- Zap: `text-amber-300` (was brand-400)

### Scroll hint
`border-amber-700/30` dot `bg-amber-300/40`

### Hero grid overlay
Add `hero-grid` CSS class: 1px amber-tinted grid lines at ~4% opacity.

---

## Section 3 — Navbar (`components/layout/Navbar.tsx`)

### Logo badge
- Transparent: `bg-white text-amber-700` (was text-brand-600)
- Scrolled: `bg-amber-600 text-white` (was bg-brand-600)

### Active nav pill
- `bg-amber-50 text-amber-800` (was bg-brand-50 text-brand-700)
- `layoutId="nav-pill"` background: `bg-amber-50`

### Active dot
`bg-amber-500` (was bg-brand-500)

### Get Started button
- Transparent: `bg-white text-amber-700 hover:bg-amber-50`
- Scrolled: `bg-amber-600 text-white hover:bg-amber-700` (was bg-brand-600)

### Mobile menu active state
`bg-amber-50 text-amber-800` (was bg-brand-50 text-brand-700)

---

## Section 4 — Landing Page Sections (`app/page.tsx` + marketing components)

### Section kicker labels (all `text-brand-500` spans)
Replace with `text-amber-600`.

### Stats section
Background: white with `border-earth-100`. Icon colours:
- Primary stats: `text-amber-600 bg-amber-50`
- Secondary stats: `text-emerald-600 bg-emerald-50`

### Features section
Feature card accent icons: swap `text-brand-600 bg-brand-50` → `text-amber-700 bg-amber-50`, sage equivalents → emerald.

### How It Works
Step number circles: `bg-amber-600 text-white` (was bg-brand-600).
Connecting lines: `border-amber-200` (was brand).

### Categories section
Category card hover ring: `ring-amber-200` (was brand).
Active/hover background: `bg-amber-50` (was brand-50).

### Trust / Verified Workers section
Badge icons: `text-emerald-600` (was sage-600).
Verified badge border: `border-emerald-200 bg-emerald-50`.

### Recent Jobs section
Job card status badges:
- OPEN: `bg-emerald-50 text-emerald-700 border-emerald-200`
- IN_PROGRESS: `bg-amber-50 text-amber-700 border-amber-200`
- COMPLETED: `bg-earth-100 text-earth-600`

### CTA banner
Replace gradient `from-brand-600 to-accent-600` with `bg-[#1a0f02]` (deep warm dark).
CTA button: `bg-amber-500 hover:bg-amber-400 text-white`.

---

## Section 5 — Dashboard (`components/layout/DashboardFrame.tsx` + dashboard pages)

### Sidebar user card
Remove `bg-gradient-to-br ${roleGradients[user.role]}`.
Replace with clean white header:
```
bg-white border-b border-earth-100
```
Initial circle: `bg-amber-100 text-amber-800` for all roles.
Name text: `text-earth-900`. Role label: `text-earth-500`.

### `roleGradients` constant — remove entirely.
`roleBadgeColors` — keep but remap: CUSTOMER `border-amber-200 bg-amber-50 text-amber-800`, WORKER `border-emerald-200 bg-emerald-50 text-emerald-800`, ADMIN `border-stone-300 bg-stone-100 text-stone-700`.

### Dashboard background
`DashboardFrame` outer div: `bg-[#faf9f6]` (was `bg-gradient-to-br from-earth-50 to-earth-100/60`).

### Active sidebar nav item
`text-amber-800 font-semibold` (was text-brand-700).
Active pill background: `bg-amber-50` (was bg-brand-50).
Active dot: `bg-amber-500` (was bg-brand-500).
Active icon: `text-amber-600` (was text-brand-600).

### Mobile dashboard header
Replace `bg-gradient-to-r ${roleGradients[user.role]}` with `bg-[#1a0f02]`.
Initial circle: `bg-amber-800/40 text-white`.
Role badge: `bg-amber-700/30 text-amber-200`.

### Mobile tab nav active state
`border-amber-200 bg-amber-50 text-amber-800` (was border-brand-200 bg-brand-50 text-brand-700).

### Customer dashboard
- Page kicker `text-brand-500` → `text-amber-600`
- Activity overview stat icons: Open/Active `text-amber-600 bg-amber-50`, With Applicants `text-emerald-600 bg-emerald-50`, Completed `text-earth-600 bg-earth-100`
- Pro tip card: `from-amber-50 to-emerald-50/40` (was from-brand-50 to-accent-50)
- Pro tip link: `text-amber-700 hover:text-amber-800`

### StatCard component
Active/hover: `bg-amber-50 text-amber-700` (was brand).

### Worker & Admin dashboards
Apply same token swap: all `brand-*` → `amber-*`, all `sage-*` → `emerald-*`, all `accent-*` → `rose-*`.

---

## Files to Change

| File | Change summary |
|------|---------------|
| `tailwind.config.ts` | Remap brand → amber, sage → emerald, neon-amber shift |
| `app/globals.css` | Base bg, glow shadow colour, gradient-brand |
| `components/marketing/HeroSection.tsx` | Orb colours, card style, text gradient, particles, rings, buttons |
| `components/layout/Navbar.tsx` | Logo, active states, CTA button |
| `app/page.tsx` (and marketing components) | All kicker, icon, and accent colour swaps |
| `components/layout/DashboardFrame.tsx` | Remove role gradients, flat header, amber active states |
| `app/dashboard/customer/page.tsx` | Kicker, stat icons, pro tip gradient |
| `app/dashboard/worker/page.tsx` | Same token swap |
| `app/dashboard/admin/page.tsx` | Same token swap |
| `components/dashboard/StatCard.tsx` | Active/hover state colours |

---

## Out of Scope

- No layout structure changes (sidebar stays, hero grid stays, floating cards stay)
- No typography changes beyond improving weight hierarchy where it touches colour
- No routing or data changes
- No new components — only re-skin existing ones
