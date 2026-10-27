# Production Scaling Proposals — PracticeCF

This document proposes improvements to evolve PracticeCF from an MVP revision tracker into a production-grade full-stack platform for Codeforces practice and grinding.

Proposals are grouped by priority tier and area. Each item includes rationale and suggested approach.

---

## Vision

**Target product:** A platform where competitive programmers can:

- Track and revise past solves on a spaced-repetition schedule
- Plan daily grinding sessions by rating, topic, and difficulty
- Measure consistency (streaks, heatmaps, topic coverage)
- Retain techniques via notes, tags, and re-solve tracking
- Compete or collaborate via friends, groups, or shared problem sets

The current app covers **auth + handle linking + revision list + basic histogram**. The proposals below extend that into a complete grinding workflow.

---

## Tier 1 — Foundation (Do First)

These changes unblock reliability, maintainability, and safe production deployment.

### 1.1 Shared Auth Context

**Problem:** Navbar and Profile each call `/api/auth/me` independently. Auth state can desync; every new page would duplicate this logic.

**Proposal:**

- Add `AuthProvider` (React Context) wrapping the app in `main.tsx`.
- Expose `{ user, isLoading, isAuthenticated, login, logout, refreshUser }`.
- Navbar and pages consume context instead of fetching directly.
- Add `ProtectedRoute` wrapper for `/profile` and optionally `/`.

**Impact:** Single source of truth, easier onboarding checks, cleaner components.

### 1.2 Onboarding Flow

**Problem:** New users land on an empty dashboard with a cryptic error if handle is not set.

**Proposal:**

- After OAuth, detect `!user.handle` and show a guided modal or `/onboarding` page:
  1. Welcome + explain spaced revision
  2. Enter Codeforces handle (with live validation)
  3. Show sync progress (“Importing your last 30 days…”)
  4. Redirect to dashboard with sample data
- Block dashboard revision fetch until handle exists; show CTA instead of error.

**Impact:** Dramatically improves first-run conversion and reduces support confusion.

### 1.3 Unified Design System

**Problem:** Tailwind is installed but unused; three CSS files duplicate card/button/shadow patterns.

**Proposal:**

- **Pick one approach:** either commit to Tailwind utilities or extract shared CSS variables/components — not both half-used.
- Recommended: Tailwind + small set of compound components (`Card`, `Button`, `Badge`, `EmptyState`, `Skeleton`).
- Define design tokens: colors, spacing, typography (apply Inter globally).
- Add dark mode via `prefers-color-scheme` or toggle (popular among devs grinding at night).

**Impact:** Faster feature development, consistent look, easier mobile responsiveness.

### 1.4 API Layer Refactor

**Problem:** API calls scattered across pages; types duplicated; inconsistent path prefixes.

**Proposal:**

```
src/
  api/
    client.ts          # axios instance + interceptors
    auth.ts            # me, logout
    revise.ts          # getRevisionSolves
    stats.ts           # histogram, streaks (future)
    handle.ts          # setHandle
  types/
    user.ts
    solve.ts
    stats.ts
```

- Centralize error handling in axios interceptors (401 → redirect to login).
- Use React Query (TanStack Query) for caching, refetch, and loading/error states.

**Impact:** Less boilerplate, automatic cache invalidation after handle submit or sync.

### 1.5 Environment & Deployment Hygiene

**Proposal:**

- Add `.env.example` with `VITE_BASE_URL=http://localhost:3000`.
- Remove committed `dist/` from git; build in CI/CD.
- Add GitHub Actions: `lint`, `tsc`, `build` on PR.
- Document split deployment: frontend (Netlify/Vercel) + backend (Railway/Fly/Render) with CORS/cookie config.

**Impact:** Safer releases, easier contributor setup.

### 1.6 Fix Backend Issues Blocking Production

Several backend bugs affect frontend reliability (fix in parallel):

| Issue | Effect |
|-------|--------|
| `server.ts` calls `app.listen` twice | Port conflicts / double startup |
| `dailySync.job.ts` queries `users` (lowercase) vs `"User"` table | Daily sync silently fails |
| `handle.service.ts` duplicate-check logic appears broken | Handle collision edge cases |
| No rate-limit or retry UI when CF API fails | Profile/dashboard empty with no explanation |

---

## Tier 2 — Core Product Features

Features that directly serve the “practice and grind Codeforces” mission.

### 2.1 Richer Revision Dashboard

**Current:** Flat list of problem names for three fixed day offsets.

**Proposals:**

| Feature | Description |
|---------|-------------|
| **Problem metadata** | Show difficulty (rating), tags, contest name. Requires backend to store/enrich from CF problem API. |
| **Revision status** | Mark problems as “Revised”, “Skipped”, “Need hint”. Track completion rate per bucket. |
| **Smart ordering** | Sort by rating ascending within bucket, or prioritize weak tags. |
| **Inline actions** | Open in CF, copy problem ID, add note, mark done — without leaving the app. |
| **Bucket counts** | Badge on each tab: `Yesterday (5)`, `7 Days (12)`, etc. |
| **Empty state guidance** | “No problems from 7 days ago — keep grinding today!” with link to recommended problems. |

**Backend additions:** `RevisionStatus` table or fields on `Solve`; optional `ProblemMeta` cache table.

### 2.2 Analytics & Grind Metrics

**Current:** 30-day histogram on profile only.

**Proposals:**

- **Activity heatmap** (GitHub-style) for the last 365 days.
- **Streak counter:** consecutive days with ≥1 solve.
- **Rating vs. solve scatter:** are you solving problems above or below your rating?
- **Tag breakdown:** pie/bar chart of topics solved in last 7/30/90 days (requires tag enrichment).
- **Weekly summary email/notification:** “You solved 14 problems; 3 are due for revision.”

**New page:** `/stats` or expand `/profile` into tabbed sections (Overview | Activity | Tags).

### 2.3 Daily Grind Planner

**Problem:** Revision is reactive (look back). Grinders also need proactive daily targets.

**Proposal — `/grind` page:**

- Set a daily target (e.g., “3 problems rated 1400–1600”).
- Pull unsolved problems from CF API filtered by rating/tags (or user-curated lists).
- Integrate with revision queue: “First revise 2 due problems, then solve 3 new ones.”
- End-of-day summary: target met or not.

**Backend:** Store user preferences (`targetCount`, `minRating`, `maxRating`, `preferredTags`); proxy CF problem queries with caching.

### 2.4 Personal Notes & Tags

**Proposal:**

- Per-problem notes (Markdown): approach, pitfalls, time complexity.
- User-defined tags overlay (e.g., “needs segment tree review”).
- Full-text search across notes and problem names.

**Backend:** `Note` model linked to `(userId, contestId, index)`.

### 2.5 Problem Sets & Curated Paths

**Proposal:**

- Pre-built ladders: “800→1200 newbie grind”, “DP 30-day plan”.
- User-created lists: add problems from revision queue or search.
- Track progress per list (% completed, next recommended).

**Backend:** `ProblemSet`, `ProblemSetItem`, `UserProgress` models.

---

## Tier 3 — UX & Frontend Architecture

### 3.1 Layout & Navigation Redesign

**Current:** Navbar + single-column content.

**Proposed layout:**

```text
┌──────────────────────────────────────────────────────────┐
│  Logo   Dashboard  Grind  Stats  Lists     [User menu]  │
├────────────┬─────────────────────────────────────────────┤
│  Sidebar   │  Main content                               │
│  (mobile   │                                             │
│   drawer)  │                                             │
│            │                                             │
│  Quick:    │                                             │
│  Due today │                                             │
│  Streak 🔥 │                                             │
└────────────┴─────────────────────────────────────────────┘
```

- Collapsible sidebar on desktop; bottom nav or drawer on mobile.
- User menu: profile, settings, logout.
- Breadcrumbs for nested views (e.g., Lists → DP 30-day → Problem detail).

### 3.2 Loading & Error UX

- Skeleton loaders for dashboard list and profile chart.
- Toast notifications for handle submit success, refresh failure, sync complete.
- Error boundary at app root with “Retry” and support link.
- Offline indicator if API unreachable.

### 3.3 URL-Driven State

- Dashboard filter in query param: `/?bucket=7d` — shareable, back-button friendly.
- Persist last-selected bucket in `localStorage`.

### 3.4 Accessibility

- Semantic HTML: `<main>`, `<nav>`, heading hierarchy.
- Keyboard navigation for filter tabs (roving tabindex).
- Chart accessible summary table as fallback.
- WCAG AA contrast on all rank colors.

---

## Tier 4 — Backend & Infrastructure Scale

### 4.1 Data Model Extensions

```prisma
model ProblemMeta {
  contestId   Int
  index       String
  name        String
  rating      Int?
  tags        String[]
  @@id([contestId, index])
}

model RevisionLog {
  id        String   @id
  userId    String
  solveId   String
  status    RevisionStatus  // REVISED | SKIPPED | PENDING
  revisedAt DateTime?
}

model UserSettings {
  userId          String @id
  dailyTarget     Int    @default(3)
  minRating       Int?
  maxRating       Int?
  timezone        String @default("Asia/Kolkata")
  emailDigest     Boolean @default(false)
}
```

### 4.2 Sync Pipeline Improvements

| Improvement | Detail |
|-------------|--------|
| **Full history backfill** | On handle link, optionally sync all AC submissions (paginated), not just 30 days |
| **Incremental sync** | Store `lastSyncedAt` per user; only fetch new submissions |
| **Problem enrichment job** | Batch-fetch problem info from CF API; cache in `ProblemMeta` |
| **Queue-based jobs** | Replace in-process cron with BullMQ/Redis queue for retries and observability |
| **Webhook/manual sync** | “Sync now” button on profile with rate limit (1/hour) |

### 4.3 Caching & Performance

- Redis cache for histogram, revision counts, CF problem lookups.
- CDN for static frontend assets.
- API pagination for large solve lists.
- Database indexes on `(userId, solvedAt)` — likely already helpful for revision queries.

### 4.4 Observability

- Structured logging (pino/winston) with request IDs.
- Error tracking (Sentry) on frontend and backend.
- Health check endpoint already exists (`/api/health`) — extend with DB/Redis status.
- Metrics: sync duration, CF API error rate, daily active users.

### 4.5 Security Hardening

- Rate limiting on auth and handle endpoints.
- CSRF protection if using cookies (SameSite=None requires careful setup).
- Input validation (Zod) on all POST bodies.
- Secrets management (not `.env` in production images).
- Audit log for handle changes (even if currently immutable).

---

## Tier 5 — Growth & Community Features

Longer-term features for a public production app.

### 5.1 Social & Accountability

- **Friends:** compare streaks, nudge when revision queue is full.
- **Groups / rooms:** classroom or club with shared grind targets.
- **Public profile:** optional shareable stats page (`/u/:handle`).

### 5.2 Integrations

- **Codeforces API key** for private submissions (if user has locked profile).
- **Calendar export** (ICS) for revision reminders.
- **Discord bot:** daily “you have N problems due” message.

### 5.3 Monetization (Optional)

If scaling to sustained production costs:

- Free tier: revision dashboard + 30-day stats.
- Pro: full history, tag analytics, custom problem sets, email digests.
- Keep core revision free to grow user base.

### 5.4 Mobile

- PWA with offline revision list (cached last fetch).
- Push notifications for daily revision reminders.
- Native app only if traction warrants it; PWA first.

---

## Suggested Implementation Roadmap

### Phase 1 — Production-ready MVP (2–4 weeks)

- [ ] Auth context + protected routes + onboarding flow
- [ ] API layer refactor + TanStack Query
- [ ] Unified design system + responsive layout
- [ ] Fix backend sync bugs
- [ ] CI/CD + `.env.example`
- [ ] Error/loading UX polish

### Phase 2 — Grinding core (4–6 weeks)

- [ ] Problem metadata enrichment (rating, tags on dashboard)
- [ ] Revision status tracking (mark as revised)
- [ ] Expanded stats: streak, heatmap, tag breakdown
- [ ] `/grind` daily planner with targets

### Phase 3 — Retention & depth (6–8 weeks)

- [ ] Notes and custom tags
- [ ] Problem sets and curated ladders
- [ ] Full history sync + manual “Sync now”
- [ ] Email/notification digests

### Phase 4 — Scale & community (ongoing)

- [ ] Redis job queue, caching, observability
- [ ] Friends/groups, public profiles
- [ ] PWA + push notifications

---

## Quick Wins (Low Effort, High Value)

1. **Show solve timestamps** — already in data; uncomment in `QuestionsTable`.
2. **Tab counts** — backend already returns arrays; show `.length` on filter buttons.
3. **Link logo to home** — `<Link to="/">` on PracticeCF text.
4. **Profile login CTA** — replace “Not authenticated” with Sign in button.
5. **Delete dead code** — remove `login.tsx`, commented `App.tsx` import.
6. **Apply Inter font globally** — `body { font-family: 'Inter', system-ui, sans-serif; }`.
7. **Add `.env.example`** — document required env vars.
8. **Consistent API paths** — fix Navbar `"api/auth/me"` → `"/api/auth/me"`.

---

## Tech Stack Recommendations for Scale

| Concern | Current | Recommended |
|---------|---------|-------------|
| Server state | useEffect + useState | TanStack Query v5 |
| Client state | Local useState | Zustand (only if needed) |
| Forms | Raw inputs | React Hook Form + Zod |
| Styling | Mixed CSS + unused Tailwind | Tailwind + shadcn/ui components |
| Testing | None | Vitest + React Testing Library; Playwright E2E |
| API types | Hand-written | OpenAPI codegen from backend schema |
| Monorepo | Separate folders | Consider `packages/shared` for types/constants |

---

## Success Metrics

Track these to validate production scaling:

| Metric | Target |
|--------|--------|
| OAuth → handle linked | >70% completion |
| D7 retention | >30% return within 7 days |
| Daily revision engagement | >40% of active users mark ≥1 revision/week |
| Sync reliability | >99% daily sync success rate |
| P95 API latency | <300ms for `/api/revise` |
| Frontend Lighthouse | >90 performance, >95 accessibility |

---

## Closing Notes

The current frontend is intentionally small — easy to read and extend. The highest-leverage next steps are **auth/onboarding**, **design system consolidation**, and **richer problem data on the dashboard**, because they turn a demo into something a grinder would open every day.

The backend already has the right primitives (User, Solve, OAuth, cron sync, revision windows). Production scale is less about rewriting and more about **enriching data**, **tracking revision outcomes**, and ** guiding daily practice** — turning passive lists into an active grinding companion.
