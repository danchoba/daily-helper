# Daily Helper

**Botswana's trusted micro-gig marketplace** — connecting customers with local helpers for everyday jobs like cleaning, garden work, moving, plumbing, painting, errands, and more.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom design system)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Custom JWT-based auth (jose library)
- **Architecture**: Mobile-first PWA-ready web app

## Project Structure

```
daily-helper/
├── app/                     # Next.js App Router pages + API routes
│   ├── api/                 # REST route handlers
│   │   ├── auth/            # signin, signup, signout
│   │   ├── jobs/            # CRUD + apply/select/unlock/review
│   │   ├── worker/          # profile, verification
│   │   └── admin/           # verifications, payments, jobs
│   ├── dashboard/
│   │   ├── customer/        # Customer pages
│   │   ├── worker/          # Worker pages
│   │   └── admin/           # Admin pages
│   ├── jobs/                # Public job listing + detail
│   ├── workers/             # Public worker profiles
│   ├── login/               # Login page
│   └── signup/              # Signup page
├── components/
│   ├── layout/              # Navbar, Footer
│   ├── jobs/                # JobCard, CategoryFilter
│   └── ui/                  # Badge, Alert, EmptyState, Loading
├── lib/                     # Prisma client, auth, session, utils
├── prisma/                  # schema.prisma + seed.ts
├── public/                  # Static assets + PWA manifest
└── types/                   # Shared types
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

> ⚠️ Daily Helper uses **manual payment verification** for the MVP. There is no automated payment gateway.

### How it works:

**Worker Verification Fee (BWP 50):**
1. Worker navigates to `/dashboard/worker/verification`
2. Worker sends BWP 50 via Orange Money/MyZaka to the listed number
3. Worker submits their transaction reference in the form
4. Admin reviews the request at `/dashboard/admin/verifications`
5. Admin clicks **Approve** → worker gets Trusted badge instantly

**Customer Connection Fee (BWP 25):**
1. Customer selects a worker applicant
2. Customer navigates to `/dashboard/customer/jobs/[id]/unlock`
3. Customer sends BWP 25 and submits transaction reference
4. Admin reviews at `/dashboard/admin/payments`
5. Admin clicks **Approve** (provides Job ID + Worker ID) → contact unlocked

### Why manual?
This is an intentional MVP trade-off to validate demand before integrating a real payment gateway. In production, integrate with **Orange Money API**, **MyZaka**, or **DPO Group** (Africa-focused gateway).

---

## Business Rules

- Only customers can post jobs
- Only workers can apply to jobs
- Workers cannot apply to their own jobs (enforced at API level)
- Closed/completed/cancelled jobs do not accept new applications
- Worker phone number is hidden until contact is unlocked via approved payment
- Only admin-approved verifications grant Trusted badge
- Currency displayed in BWP throughout

---

## Extending the MVP

Key areas to improve post-validation:

1. **Real payment gateway** — integrate Orange Money, MyZaka, or DPO
2. **File uploads** — use Cloudinary/S3 for ID documents and profile photos
3. **Push notifications** — notify workers of new jobs, customers of applications
4. **In-app messaging** — before/after unlock
5. **Location services** — GPS-based job discovery
6. **Mobile app** — wrap PWA in Capacitor for Android APK distribution
