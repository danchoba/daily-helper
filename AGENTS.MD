# AGENTS.md

## Project
Daily Helper is a mobile-first platform for posting and accepting local micro-gigs such as cleaning, gardening, queue-standing, moving assistance, and handyman work.

The product serves two main user types:
- Customers who post jobs and hire workers
- Workers who create profiles, discover nearby gigs, and apply

There is also an admin layer responsible for moderation, verification, payment review, and platform oversight.

This repository must be treated as a production-minded startup codebase, not a toy demo.

---

## Mission for AI Coding Agents
When working in this repository, all AI coding agents must optimize for:

1. Security
2. Maintainability
3. Simplicity
4. Good mobile UX
5. Safe iteration without breaking existing functionality

This guidance applies to any coding assistant used in the repo, including but not limited to Codex, Claude, Cursor, Copilot, Cline, Roo, Windsurf, and similar tools.

Do not rush into implementation blindly. First understand the request, inspect the affected area, think through side effects, and only then make changes.

---

## Core Working Mindset
Act like a careful senior engineer, not an autocomplete engine.

Before making changes:
- Understand what problem is actually being solved
- Identify which user role is affected
- Review related files, flows, contracts, schemas, permissions, and UI states
- Think through downstream effects and regression risk
- Prefer the simplest robust solution
- Preserve existing behavior unless the task explicitly requires a change

If a request is ambiguous, make the safest reasonable assumption and keep the implementation flexible. Do not silently invent major product decisions.

---

## Critical Thinking Rules
Before making any code change, the agent must:

### 1. Understand the feature in context
- Identify what problem is being solved
- Identify which user role is affected
- Identify which part of the journey is touched:
  - public discovery
  - customer dashboard
  - worker dashboard
  - admin dashboard
  - API
  - auth
  - payments
  - verification
  - messaging / notification behavior

### 2. Check downstream effects
- Ask: what else could this break?
- Review related components, server logic, services, validators, database models, route handlers, and permission checks
- Avoid narrow fixes that create regressions elsewhere

### 3. Prefer the simplest robust solution
- Do not introduce unnecessary abstractions
- Do not over-engineer for hypothetical scale
- Do not add dependencies unless clearly justified
- Reuse sound existing patterns where possible

### 4. Preserve existing behavior unless change is required
- Keep backward compatibility where practical
- Do not casually rename APIs, routes, props, database fields, enums, or environment variables
- Avoid broad rewrites when a focused improvement is enough

### 5. Validate the work
- Run the relevant checks
- Add or update tests for non-trivial logic
- Manually reason through edge cases even if tests pass

---

## Architecture Principles
Use a clean, modular architecture.

### Preferred structure
- `app/` or `src/app/` for routes/pages
- `components/` for reusable UI
- `features/` for domain-specific modules when needed
- `lib/` for shared utilities
- `services/` for API/data access
- `server/` for backend-only logic
- `types/` for shared types
- `validators/` for schema validation
- `tests/` for automated tests

### Separation of concerns
- UI components should be as dumb as practical
- Business logic should not be buried inside pages
- Data access should be centralized through services or server utilities
- Validation should be explicit and reusable
- Authorization must never rely on UI visibility alone

### State management
- Keep state local where possible
- Lift state only when needed
- Avoid global state unless multiple distant parts of the app truly need it
- Derived state should be computed, not duplicated

### API and domain modeling
- Keep request and response contracts explicit
- Use consistent domain language across frontend and backend
- Avoid loosely typed payloads
- Validate all external input
- Keep job lifecycle logic consistent across UI and server code

---

## Security Rules
Security is non-negotiable.

### Authentication and authorization
- Enforce authorization on the server side
- Never trust client-supplied roles, user IDs, pricing, verification flags, ownership claims, or status transitions
- Users may only access or modify resources they own or are explicitly permitted to access
- Customer, worker, and admin permissions must remain clearly separated

### Input handling
- Validate and sanitize all inputs at system boundaries
- Treat all form input, query params, headers, uploaded content, and API payloads as untrusted
- Use schema validation for all meaningful mutations and API endpoints

### Secrets and environment variables
- Never hardcode secrets, tokens, API keys, or credentials
- Use environment variables for secrets
- Do not expose server secrets to the client bundle
- Do not log secrets
- Do not commit sensitive values to the repo

### Payments and money-related logic
- Never trust client-side fee calculations
- Fee amounts, unlock logic, verification logic, and payment status decisions must be enforced on the server
- Money values must use consistent handling and naming
- Any future gateway integration must preserve idempotency and auditability

### File uploads
- Validate file type and size
- Do not trust file extensions alone
- Use safe storage patterns
- Avoid executable uploads
- Restrict access and scope uploads appropriately

### Abuse resistance
Always think beyond the happy path:
- Spam job posting
- Fake or repeated worker applications
- Duplicate submissions
- Rate abuse
- Review manipulation
- Location spoofing
- Unauthorized admin actions
- Unlock or verification fraud
- User attempts to bypass role restrictions
- Tampering with job ownership or lifecycle state

Whenever implementing a feature, ask:
**How could this be abused, spoofed, replayed, or bypassed?**

---

## UI / UX Rules
Daily Helper should feel modern, trustworthy, and easy to use on a phone.

### Design principles
- Mobile-first always
- Clear hierarchy
- Generous spacing
- Simple flows
- Strong readability
- Minimal clutter
- Fast perceived performance

### Visual style
- Clean, modern, slightly premium
- Warm, trustworthy, and practical
- Friendly but not childish
- Consistent spacing, radius, shadows, and typography
- Prioritize legibility over decoration
- Avoid flashy UI that harms usability

### UX expectations
- Forms must be straightforward and forgiving
- Errors must be clear and actionable
- Loading states must be visible
- Empty states should help the user move forward
- Important actions must have confirmation where risk exists
- Destructive actions must be clearly marked
- Buttons and touch targets must work well on small screens

### Accessibility
- Use semantic HTML
- Ensure keyboard accessibility where applicable
- Maintain sufficient color contrast
- Provide labels for inputs
- Avoid relying only on color for meaning

### Responsiveness
- Every screen must work well on mobile widths first
- Then scale gracefully to tablet and desktop
- Do not ship layouts that only look good on large screens

---

## Performance Rules
- Optimize the critical path for mobile users on unreliable networks
- Avoid unnecessary re-renders
- Avoid oversized bundles
- Lazy-load heavy modules where appropriate
- Paginate or limit large datasets
- Optimize images and media
- Prefer efficient queries and indexed lookups on the backend

Do not sacrifice correctness for micro-optimizations, but do avoid obvious waste.

---

## Code Quality Standards
- Write clear, readable code
- Favor explicitness over cleverness
- Use meaningful names
- Keep functions focused
- Keep files manageable in size
- Add comments only where intent is not obvious
- Remove dead code and placeholders when touching affected areas

### Avoid
- Massive components with mixed concerns
- Hidden side effects
- Magic strings scattered everywhere
- Unhandled promise rejections
- Silent failures
- Broad try/catch blocks that swallow errors
- “Fixes” that only patch the symptom while leaving inconsistent logic behind

---

## Testing Expectations
For non-trivial changes, the agent should add or update tests.

Focus on:
- Core business logic
- Validation
- Permissions
- Critical user flows
- Edge cases
- Regression protection for bug fixes

Minimum expectation:
- If logic changes, test it
- If permissions change, test them
- If validation changes, test valid and invalid cases
- If state transitions change, test allowed and disallowed transitions

---

## Error Handling and Observability
- Fail safely
- Return useful error messages without leaking internals
- Log enough for debugging, but never log secrets or sensitive personal data
- Handle empty, null, offline, timeout, and duplicate-submission scenarios gracefully
- Prefer explicit error states over mysterious UI failure

---

## Product-Specific Rules for Daily Helper
All agents must preserve and reinforce these product truths:

### 1. Trust is a core product feature
The UI and logic should make the platform feel safe and credible.

### 2. Worker and customer flows are distinct
Do not mix assumptions between them.

### 3. Admin actions are high risk
Admin tools must be guarded carefully and designed clearly.

### 4. Verification matters
Verified status, reviews, trust indicators, and unlock states must not be easy to spoof.

### 5. Location matters
Nearby job discovery and local relevance should be treated carefully.
Do not fake precision where data is weak.

### 6. Manual payment flow is intentional in the MVP
Current payment verification is admin-reviewed and manual.
Do not accidentally introduce assumptions that a payment is instantly confirmed unless the implementation explicitly supports that.

### 7. Job lifecycle must remain consistent
Jobs should move through clear states such as:
- Draft
- Posted
- Applied
- Assigned
- In Progress
- Completed
- Cancelled
- Disputed

Do not introduce inconsistent status handling across frontend, backend, database logic, or admin tools.

### 8. Contact access is gated
Worker contact details must stay protected until the unlock flow is successfully approved according to platform rules.

---

## Change Management Rules
When implementing a task, the agent should:

1. Inspect the existing implementation first
2. Reuse existing patterns where they are good
3. Improve weak patterns carefully without causing broad breakage
4. Keep diffs focused
5. Mention tradeoffs when they matter
6. Avoid unrelated refactors unless necessary for correctness or maintainability

If a refactor is necessary, keep it scoped and explain why.

---

## Dependency Rules
- Prefer built-in platform capabilities and existing repo dependencies
- Add a new package only when it provides clear value
- Avoid dependencies with overlapping functionality already present in the project
- Avoid dependencies that weaken security or bloat the app

Before adding a dependency, ask:
- Can the current stack already solve this?
- Is this dependency mature and well maintained?
- Is it worth the bundle, security, and maintenance cost?

---

## Delivery Expectations
When finishing a task, the agent should provide:

1. What changed
2. Why it changed
3. Any assumptions made
4. Risks or follow-ups
5. How it was validated

Keep the summary concise but useful.

---

## Repo Commands
Agents should discover and use the correct commands from `package.json` or repo configuration instead of assuming.

Typical commands may include:
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

If exact commands differ, follow the repository’s actual configuration.

---

## Final Rule
Do not behave like a code generator.

Behave like a careful senior engineer working on a real product.

Think before changing.
Check what the change affects.
Protect security.
Keep the UX clean.
Keep the architecture sane.
Leave the codebase better than you found it.