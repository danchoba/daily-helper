# Daily Helper

**Botswana's trusted micro-gig marketplace** — connecting customers with local helpers for everyday jobs like cleaning, garden work, moving, plumbing, painting, errands, and more.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom warm design system)
- **Animations**: Framer Motion
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Custom JWT-based auth (jose library) with bcrypt password hashing
- **File Uploads**: Vercel Blob (`@vercel/blob`) — scoped by worker ID
- **Email**: Resend (transactional notifications, optional)
- **Validation**: Zod
- **Architecture**: Mobile-first, PWA-ready

## Project Structure

```
daily-helper/
├── app/
│   ├── api/
│   │   ├── auth/            # signin, signup, signout
│   │   ├── jobs/            # CRUD + apply / select / unlock / review
│   │   ├── worker/          # profile, verification
│   │   ├── admin/           # verifications, payments, jobs
│   │   ├── categories/      # job categories list
│   │   └── upload/          # Vercel Blob file upload (workers only)
│   ├── dashboard/
│   │   ├── customer/        # post jobs, view applicants, unlock contacts, leave reviews
│   │   ├── worker/          # browse jobs, manage applications, profile, verification
│   │   └── admin/           # manage users, verifications, payments, jobs
│   ├── jobs/                # public job listing + detail + apply
│   ├── workers/             # public worker profiles
│   ├── login/
│   ├── signup/
│   └── page.tsx             # marketing landing page
├── components/
│   ├── dashboard/           # StatCard
│   ├── jobs/                # JobCard, CategoryFilter, JobFiltersClient, JobTabs
│   ├── layout/              # Navbar, Footer, DashboardFrame
│   ├── marketing/           # HeroSection, MarketplacePreview, LandingJobCard,
│   │                        # LandingWorkerCard, CTABadges, MotionSection, Reveal
│   ├── ui/                  # Alert, Badge, Breadcrumbs, Button, Card, EmptyState,
│   │                        # Input, Loading, PageSkeleton, Select, StarRating,
│   │                        # Textarea, Toast
│   └── workers/             # WorkerCard
├── lib/
│   ├── auth.ts              # JWT creation + requireRole helper
│   ├── session.ts           # cookie-based session management
│   ├── db.ts / prisma.ts    # Prisma client singleton
│   ├── email.ts             # Resend email helpers (new application, worker selected)
│   ├── rateLimit.ts         # In-memory IP rate limiter (429 responses)
│   ├── validators.ts        # Zod schemas
│   ├── utils.ts             # Shared utilities
│   └── cn.ts                # Tailwind class merging
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/                  # Static assets + PWA manifest
└── types/                   # Shared TypeScript types
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted — e.g. Supabase, Railway, Neon)

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/daily_helper"
NEXTAUTH_SECRET="your-long-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Optional variables:

```env
# Resend — email notifications (new applications, worker selected)
RESEND_API_KEY="re_..."

# Vercel Blob — worker ID document / photo uploads
BLOB_READ_WRITE_TOKEN="vercel_blob_..."
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 4. Database Setup

```bash
# Create the database (if using local PostgreSQL)
createdb daily_helper

# Run Prisma migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate
```

### 5. Seed Demo Data

```bash
npm run db:seed
```

### 6. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

After seeding, these accounts are available:

| Role     | Email                    | Password    | Notes                         |
|----------|--------------------------|-------------|-------------------------------|
| Admin    | admin@dailyhelper.bw     | admin123    | Full admin access             |
| Customer | thabo@example.com        | password123 | Has posted several jobs       |
| Customer | naledi@example.com       | password123 | Jobs in Francistown           |
| Worker   | kgosi@example.com        | password123 | **Trusted badge**, rating 4.8 |
| Worker   | mpho@example.com         | password123 | Pending verification          |
| Worker   | boitumelo@example.com    | password123 | New, no verification          |

---

## Prisma Commands

```bash
npm run db:migrate       # Create + run new migration
npm run db:push          # Push schema without migration (dev)
npm run db:generate      # Regenerate Prisma client
npm run db:seed          # Run seed script
npm run db:studio        # Open Prisma Studio (GUI)
```

---

## MVP Payment Flow (Manual)

> Daily Helper uses **manual payment verification** for the MVP. There is no automated payment gateway.

### How it works:

**Worker Verification Fee (BWP 50):**
1. Worker navigates to `/dashboard/worker/verification`
2. Worker uploads their ID document (JPG/PNG/PDF, max 5 MB — stored in Vercel Blob)
3. Worker sends BWP 50 via Orange Money/MyZaka and submits the transaction reference
4. Admin reviews the request at `/dashboard/admin/verifications`
5. Admin clicks **Approve** → worker gets Trusted badge instantly

**Customer Connection Fee (BWP 25):**
1. Customer selects a worker applicant
2. Customer navigates to `/dashboard/customer/jobs/[id]/unlock`
3. Customer sends BWP 25 and submits transaction reference
4. Admin reviews at `/dashboard/admin/payments`
5. Admin clicks **Approve** → contact details unlocked

### Why manual?
Intentional MVP trade-off to validate demand before integrating a real payment gateway. In production, integrate with **Orange Money API**, **MyZaka**, or **DPO Group** (Africa-focused gateway).

---

## Email Notifications

When `RESEND_API_KEY` is set, the app sends two transactional emails:

| Trigger | Recipient | Subject |
|---------|-----------|---------|
| Worker applies to a job | Customer | `New applicant for "<job title>"` |
| Customer selects a worker | Worker | `You've been selected for "<job title>"` |

Emails are silently skipped if the env variable is not set, so local dev works without Resend.

---

## Rate Limiting

Auth endpoints use an in-memory IP-based rate limiter (`lib/rateLimit.ts`). On single-instance deployments this works out of the box. For multi-instance or serverless scale, swap the in-memory store for **Upstash Redis**.

---

## Business Rules

- Only customers can post jobs
- Only workers can apply to jobs
- Workers cannot apply to their own jobs (enforced at API level)
- Closed/completed/cancelled jobs do not accept new applications
- Worker phone number is hidden until contact is unlocked via approved payment
- Only admin-approved verifications grant the Trusted badge
- Currency displayed in BWP throughout

---

## Extending the MVP

Key areas to improve post-validation:

1. **Real payment gateway** — integrate Orange Money, MyZaka, or DPO Group
2. **Multi-instance rate limiting** — replace in-memory store with Upstash Redis
3. **Push notifications** — notify workers of new jobs, customers of applications
4. **In-app messaging** — before/after contact unlock
5. **Location services** — GPS-based job discovery
6. **Mobile app** — wrap PWA in Capacitor for Android APK distribution
