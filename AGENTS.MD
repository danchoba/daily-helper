# AGENTS.md

## Project
Daily Helper is a mobile-first platform for posting and accepting local micro-gigs such as cleaning, gardening, queue-standing, moving assistance, and handyman work. The product serves two main user types:
- Customers who post jobs and hire workers
- Workers who create profiles, discover nearby gigs, and apply

This repository must be treated as a production-minded startup codebase, not a toy demo.

---

## Mission for Codex
When working in this repository, optimize for:
1. Security
2. Maintainability
3. Simplicity
4. Good mobile UX
5. Safe iteration without breaking existing functionality

Never rush into implementation blindly. First understand the request, inspect the affected area, think through side effects, and only then make changes.

---

## Critical Thinking Rules
Before making any code change, Codex must:

1. Understand the feature in context
- Identify what problem is being solved
- Identify which user role is affected
- Identify what existing flows might be impacted

2. Check downstream effects
- Ask: what else could this break?
- Review related components, hooks, services, schemas, validation, permissions, and API contracts
- Avoid narrow fixes that create regressions elsewhere

3. Prefer the simplest robust solution
- Do not introduce unnecessary abstractions
- Do not over-engineer for hypothetical scale when a clear, extensible solution is enough
- Do not add dependencies unless clearly justified

4. Preserve existing behavior unless the task explicitly requires change
- Keep backward compatibility where practical
- Do not casually rename APIs, routes, props, database fields, or environment variables
- Avoid UI rewrites when a targeted improvement is enough

5. Validate your work
- Run relevant tests
- Add tests when introducing logic
- Manually reason through edge cases even if tests pass

If the task is ambiguous, do not invent major product decisions silently. Make the safest reasonable assumption and keep the implementation flexible.

---

## Architecture Principles
Use a clean, modular architecture.

### Preferred structure
- `app/` or `src/app/` for routes/pages
- `components/` for reusable UI
- `features/` for domain-specific modules
- `lib/` for shared utilities
- `services/` for API/data access
- `server/` for backend-only logic
- `types/` for shared types
- `validators/` for schema validation
- `tests/` for automated tests

### Separation of concerns
- UI components should be as dumb as practical
- Business logic should not be buried inside pages
- Data fetching should be centralized through services/hooks
- Validation should be explicit and reusable
- Authorization checks must never rely on UI visibility alone

### State management
- Keep state local where possible
- Lift state only when needed
- Avoid global state unless multiple distant parts of the app truly need it
- Derived state should be computed, not duplicated

### API and domain modeling
- Keep request/response contracts explicit
- Use consistent domain language across frontend and backend
- Avoid loosely typed “any-shaped” payloads
- Validate all external input

---

## Security Rules
Security is non-negotiable.

### Authentication and authorization
- Enforce authorization on the server side
- Never trust client-supplied roles, user IDs, pricing, verification flags, or ownership claims
- Users may only access or modify resources they own or are explicitly permitted to access
- Worker/customer/admin permissions must be clearly separated

### Input handling
- Validate and sanitize all inputs at boundaries
- Treat all form input, query params, headers, uploaded content, and API payloads as untrusted
- Use schema validation for all important mutations and API endpoints

### Secrets and environment variables
- Never hardcode secrets, tokens, API keys, or credentials
- Use environment variables for secrets
- Do not expose server secrets to the client bundle
- Do not log secrets

### Payments and money-related logic
- Never trust client-side fee calculations
- All payment, payout, verification-fee, escrow, or commission logic must be computed securely on the server
- Money values must use consistent precision-safe handling

### File uploads
- Validate file type and size
- Do not trust file extensions alone
- Use safe storage patterns
- Avoid executable uploads where unnecessary

### Abuse resistance
Design for misuse, not just happy paths:
- Spam job posting
- Fake worker applications
- Repeated actions from impatient users
- Duplicate submissions
- Rate abuse
- Review manipulation
- Location spoofing
- Unauthorized admin actions

Whenever implementing a feature, think: “How would this be abused?”

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
- Friendly but not childish
- Use consistent spacing, radius, shadows, and typography
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
- Add comments only where intent is not obvious from the code
- Do not leave dead code, unexplained hacks, or placeholder logic behind

### Avoid
- Massive components with mixed concerns
- Hidden side effects
- Magic strings scattered everywhere
- Unhandled promise rejections
- Silent failures
- Broad try/catch blocks that swallow errors

---

## Testing Expectations
For non-trivial changes, Codex should add or update tests.

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

---

## Error Handling and Observability
- Fail safely
- Return useful error messages to users without leaking internals
- Log enough for debugging, but never log secrets or sensitive personal data
- Handle empty, null, offline, timeout, and duplicate-submission scenarios gracefully

---

## Product-Specific Rules for Daily Helper
Codex must preserve and reinforce these product truths:

1. Trust is a core product feature
- UI and logic should make the platform feel safe and credible

2. Worker and customer flows are distinct
- Do not mix assumptions between them

3. Location matters
- Nearby job discovery and local relevance should be treated carefully
- Do not fake precision where data is weak

4. Verification matters
- Verified status, reviews, and trust indicators must not be easy to spoof

5. Admin power is high risk
- Admin tools must be guarded carefully and designed clearly

6. Job lifecycle must remain consistent
A job should move through clear states such as:
- Draft
- Posted
- Applied
- Assigned
- In Progress
- Completed
- Cancelled
- Disputed

Do not introduce inconsistent status logic across frontend and backend.

---

## Change Management Rules
When implementing a task, Codex should:

1. Inspect the existing implementation first
2. Reuse existing patterns where they are good
3. Improve weak patterns carefully without causing broad breakage
4. Keep diffs focused
5. Mention tradeoffs when they matter
6. Avoid unrelated refactors unless they are necessary for correctness or maintainability

If a refactor is necessary, keep it scoped and explain why.

---

## Dependency Rules
- Prefer built-in platform capabilities and existing repo dependencies
- Add a new package only when it provides clear value
- Avoid dependencies with overlapping functionality already present in the project
- Avoid dependencies that weaken security or bloat the app

---

## Pull Request / Delivery Expectations
When finishing a task, Codex should provide:
1. What changed
2. Why it changed
3. Any assumptions made
4. Risks or follow-ups
5. How it was validated

---

## Commands
Codex should discover and use the correct commands from `package.json` or repo config.

Typical commands may include:
- install: `npm install`
- dev: `npm run dev`
- build: `npm run build`
- lint: `npm run lint`
- test: `npm run test`

If exact commands differ, follow the repository’s actual configuration instead of forcing assumptions.

---

## Final Rule
Do not behave like a code generator. Behave like a careful senior engineer.

Think before changing.
Check what the change affects.
Protect security.
Keep the UX clean.
Keep the architecture sane.
Leave the codebase better than you found it.