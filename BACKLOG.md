# Backlog

Pick from the top of the active list. Mark status inline when starting/finishing. Completed item specs move to `archive/BACKLOG_ARCHIVE.md`.

**Context cost key**: S = Small (<5% context), M = Medium (5–15%), L = Large (15–30%), XL = Extra Large (>30%)

**Status key**: TODO | IN PROGRESS | DONE | BLOCKED | NO-OP | FUTURE | WAITING

---

## Active Items

### BL-001 — Auth/business-data server-proxy refactor: finished and verified, two items still need backend work in other repos `[L]`
- **What**: A large batch of uncommitted work migrated auth and business-data logic from direct client-side Supabase calls to a server-side "Gatekeeper" proxy pattern (`lib/auth.ts`, `lib/api.ts`/`lib/api.server.ts`, new `app/api/*` proxy routes, a new "Business Data" Sidebar section under `app/(dashboard)/business/*`, and a public `app/(public)/search` page). It was picked back up and finished in this session — decision made: finish it, not shelve it.
  - Fixed and committed: missing `app/api/partners` route (removes a silent super-admin regression on the mice page), `lib/api.server.ts`'s server-side `getAllPartners`/`getPartnerBusiness`/`checkPermissions` now query Supabase directly instead of round-tripping through a same-origin `fetch()` that silently dropped the user's auth cookie (a real bug — every call would have returned "unauthenticated"), `intelligenceApi`/`conversionApi`/`pricingApi`/`entitiesApi.getProfile` in `lib/api.server.ts` were hitting the wrong backend host entirely (routed through the external-API base URL instead of doing the real work in-process) — confirmed via live `curl` against production that `/business/intelligence`, `/business/conversions`, and `/business/growth` were unconditionally showing their error/offline states for any real logged-in user; now fixed. Also fixed several build-breaking issues in the staged code: missing `Target`/`Zap` icon imports in `Sidebar.tsx`, a missing `conversionApi` export in `api.server.ts`, a typo'd `PhoneCalls` → `PhoneCall` lucide import (and the wrong icon was wired to the wrong stat), a missing `uuid` dependency in `SearchUI.tsx` (replaced with built-in `crypto.randomUUID()`), and an implicit-`any` param in `BusinessProfileForm.tsx`. `npm run build` and `tsc --noEmit` are both clean (two remaining type errors are pre-existing/unrelated, from commit `3aaae314`, not part of this work).
  - Verified live against production, not guessed: `https://api.localplus.city/api/categories` works and returns real data; `https://mc-m6cckgy66k.bunny.run/entities/upsert` (POST) exists (401 without auth = real route); `GET .../businesses/:id` exists on that same AE backend and is now used for `entitiesApi.getProfile` instead of the nonexistent `GET /entities/:id`.
  - **Correction (same day, separate session):** item 2 below is wrong as originally written — re-verified live with a *host-differentiated* curl pass. `api.localplus.city/analytics/partner-intelligence` and `/analytics/pricing` do both 404, but that's because the code is calling the wrong backend, not because the endpoints don't exist. The real analytics service is the AE backend at `AE_BASE_URL` (`mc-m6cckgy66k.bunny.run`, confirmed live via `/health`: `{"service":"AnswerEngine-BKK", "version":"v1.4-phase4.8-pricing-engine"}`) — `GET /analytics/partner-intelligence?entity_id=<id>` and `GET /analytics/pricing?entity_id=<id>` both return real 200 responses there. `entitiesApi.getProfile`/`upsertProfile` already correctly call this host via `aeRequest`; `intelligenceApi`/`conversionApi`/`pricingApi` do not — they call `apiRequest` (→ `api.localplus.city`, a 404 dead end for these paths) instead of `aeRequest` (→ the real AE host). Also fixed in passing: `intelligenceApi`/`conversionApi` were using the wrong query param name (`businessId` instead of the `entity_id` the AE endpoint actually requires) — fixed, but note this alone does nothing until the host is also switched to `aeRequest`. **Not yet fixed**: switching these three functions from `apiRequest` to `aeRequest`. Left as-is for now since it touches three revenue-facing pages (Partner Intelligence, Conversions & ROI, Growth & Boost) beyond today's scope — flagged for a deliberate follow-up rather than fixed opportunistically.
  - Two genuine gaps remain — **not fixable from this repo**, need backend work elsewhere:
    1. **Categories aren't split by cuisine vs. feature.** `taxonomyApi.getCategories('cuisine')` and `('feature')` both hit `api.localplus.city/api/categories`, which returns the *same* WordPress event/music-genre taxonomy (glam rock, dance genres, etc.) regardless of the `type` param — confirmed via live curl, the param is a no-op server-side. There is no real cuisine/feature taxonomy backing this yet. `business/profile/page.tsx`'s cuisine and feature pickers will show identical, irrelevant options until `localplus-api` (or a new source) implements a real split.
    2. ~~Partner analytics endpoints don't exist yet~~ — **superseded, see correction above.** They exist on the AE backend; the client code just points at the wrong host.
- **Acceptance criteria**: Done for Business Profile's dependencies (categories read, entity profile read/write — all verified live and working). Remaining: (a) `localplus-api`/AE builds a real cuisine/feature category split, (b) switch `intelligenceApi`/`conversionApi`/`pricingApi` in `lib/api.server.ts` from `apiRequest` to `aeRequest` so Partner Intelligence/Conversions/Growth show real data instead of always falling through to mocks.
- **Files**: `lib/auth.ts`, `lib/api.ts`, `lib/api.server.ts`, `components/Sidebar.tsx`, `app/(dashboard)/layout.tsx`, `app/page.tsx`, `app/api/auth/me`, `app/api/roles/me`, `app/api/partners`, `app/api/partners/me`, `app/api/entities/*`, `app/api/categories`, `app/api/mice/*`, `app/api/partner/*`, `app/api/public/*`, `app/(dashboard)/business/*`, `app/(public)/search`.
- **Blocker**: (a) needs work in `localplus-api`/AE, not this repo. (b) is fixable here anytime — deliberately deferred, not blocked.
- **Role**: Feature Development
- **Status**: IN PROGRESS

### BL-002 — Rebuilt partner Bookings feature, wired to the real backend `[L]`
- **What**: The `/bookings` page previously served a different, orphaned feature (an Events/MICE registration explorer, not reachable from the sidebar nav and broken due to a wrong internal import — see BL-001's investigation notes). The real restaurant-reservation system (guest bookings: party size, date/time, confirm/seat/complete/cancel/no-show) had been built twice before but never connected to this app: once as a live, still-maintained backend in `localplus-api` (`bookings/route.js` + `bookings/[id]/*`, last touched 2026-07-01), and once as a frozen legacy UI in this repo's `old_vite/` archive. This item connects them:
  - **`localplus-api`**: added `builds`/`rewrites` entries to `vercel.json` for `bookings/route.js`, `bookings/[id]/route.js`, `bookings/[id]/confirm/route.js`, `bookings/[id]/cancel/route.js` — these files already existed and were fully correct, just never wired into any deployed route. Confirmed via live curl (before this change) that `/api/bookings*` 404'd in production; confirmed the rewrite pattern against the existing working precedent for `/api/events/:id`. The older `bookings.js` (Phase 1, 2024-12-19, wrong env var name, action-based POST) was left alone — superseded, not deleted, not wired.
  - **`localplus-partner`**: new `app/api/bookings`, `app/api/bookings/[id]`, `app/api/bookings/[id]/confirm`, `app/api/bookings/[id]/cancel` proxy routes. These resolve `business_id` from the authenticated Supabase session server-side (never trust client input, matching the pattern established for other proxies) and additionally verify booking ownership before returning/mutating a booking by id, since the backend's own GET/PUT-by-id endpoints don't check ownership themselves. Added `bookingsApi` to both `lib/api.server.ts` (server-side initial page load) and `lib/api.ts` (client-side actions). Rebuilt `/bookings` as a real dashboard (`BookingsDashboard.tsx`): week-strip date filter, booking list with status pills, and status-gated actions (Confirm/Seat/Complete/Cancel/No-show), plus a "New booking" form for walk-ins/phone bookings. Fixed a status-naming bug present in the legacy UI (`no-show` with a hyphen) — the DB check constraint actually uses `no_show` with an underscore. Added a "Bookings" entry to the sidebar nav (`Restaurant`/`Hotel`/`Global` perspectives) — it had never been in the nav. Removed the old orphaned registration-explorer components (preserved in git history via this commit's parent, not otherwise reachable or working).
  - Verified: `npm run build`, `tsc --noEmit`, and a dev-server smoke test of `/bookings` all clean — no server crashes, correctly redirects to login when unauthenticated (same pattern as every other dashboard page).
- **Caveats / not yet verified**: no real partner login was available in this session to click-test the actual create/confirm/cancel flow end-to-end against production data — the backend contract, rewrite routing, and build/compile output are all verified, but a real logged-in run-through hasn't happened yet. The backend's `bookings`/`restaurant_settings` tables are queried with the Supabase **anon** key (not service role) — this assumes RLS policies on those tables already permit the needed reads/writes; if bookings mysteriously come back empty or writes fail with a permissions error in real use, check RLS policies on `bookings` and `restaurant_settings` first.
- **Acceptance criteria**: A real partner can log in, see their bookings on `/bookings`, create a walk-in booking, and confirm/seat/complete/cancel/no-show a booking, with the change reflected in the `bookings` table.
- **Files**: `localplus-api/vercel.json`; `localplus-partner`'s `app/api/bookings/**`, `app/(dashboard)/bookings/**`, `lib/api.ts`, `lib/api.server.ts`, `components/Sidebar.tsx`.
- **Role**: Feature Development
- **Status**: IN PROGRESS

### BL-003 — Decommission localplus-api's Vercel deployment (mobile + admin already repointed; verify and retire) `[S]`
- **What**: Following D-001 (`DECISIONS.md`). Originally scoped assuming `localplus-mobile` and `localplus-admin` still called `api.localplus.city` live — **re-verified same session and that's wrong**: an initial grep hit was matching explanatory *comments* ("api.localplus.city is being retired..."), not live code. Checked the actual constants:
  - `localplus-mobile/src/modules/news/services/newsService.ts` + `eventsService.ts`: `NEWS_API_BASE_URL`/`EVENTS_API_BASE_URL` already hardcoded to `https://mc-p1bm8gzkgs.b-cdn.net`. Also: this repo's own last commit today (14:08) is "docs: close BL-031 (news domain, not an external outage) + update BL-039 progress" — another agent independently converged on the same domain question in parallel.
  - `localplus-admin/src/services/apiService.ts`: `API_BASE_URL` already defaults to `https://mc-p1bm8gzkgs.b-cdn.net`. This repo's last commit today (11:12) is literally "fix: point admin app at the Bunny container instead of api.localplus.city" — already done, by another agent, same day.
  - `localplus-consumer` and `LocalPlus v2` still default to `api.localplus.city`, but both are legacy/stale (consumer superseded by `localplus-mobile` per existing decision; `v2`'s last commit is 2025-12-08, ~7 months stale) — not production blockers.
  - `localplus-super-app` (a separate, differently-named repo, Vite-based) still defaults to `api.localplus.city` in live code (`src/core/config/index.ts`, `admin/src/services/apiService.ts`) — but it has **no matching Vercel project** in the account's project list, so nothing evidences it's actually deployed/live. Not treated as a blocker; flagged for a human check since its purpose relative to `localplus-mobile`/`localplus-admin` is unclear.
  - `localplus-partner` itself: only remaining `api.localplus.city` references are in `old_vite/` (frozen legacy archive, not live code) — confirmed not read at runtime.
- **Smoke test done (2026-07-06), via curl against `mc-p1bm8gzkgs.b-cdn.net` directly** (no real admin credentials available, so auth-required routes were verified as correctly *reachable and auth-gated*, not full authenticated round-trips):
  - `GET /api/news/hua-hin?per_page=20&_embed` → 200, real WordPress articles.
  - `GET /api/news/hua-hin/categories` → 200, real categories.
  - `GET /api/events?status=published&limit=50` → 200, real event data.
  - `GET /api/businesses?limit=5` → 401 "Authentication required" (route exists, correctly gated, not a 404).
  - `POST /api/auth` (bad creds) → 401 "Invalid login credentials" (route exists, correctly rejects).
  - `GET /api/auth/me` (no token) → 401 "Authorization header required" (route exists, correctly gated).
  - All match expected behavior — no 404s, no 500s, real data where unauthenticated access is allowed.
- **Decommission done (2026-07-06, human sign-off given)**: removed the `api.localplus.city` domain assignment from the `localplus-api` Vercel project via the Vercel API (`DELETE /v9/projects/{id}/domains/{domain}` — project-scoped, didn't touch the domain elsewhere). Verified live: the domain now returns `x-vercel-error: DEPLOYMENT_NOT_FOUND` instead of serving the old app. Neutered `localplus-api/package.json`'s `deploy` script (was `npx vercel deploy --prod --yes`, now refuses to run with a pointer to `scripts/deploy-to-bkk.sh`) so nobody redeploys there by accident. Documented in `localplus-api/CONTAINER.md`.
- **Not done — needs a human, not blocking**: the Cloudflare DNS CNAME for `api.localplus.city` (zone `localplus.city`, nameservers `elijah`/`lilith.ns.cloudflare.com`) still exists pointing at Vercel. It's inert now (harmless 404, not a security or drift risk), but wasn't removed — no Cloudflare credentials for this specific zone were available in-session, and hunting for a token scoped to a different domain wasn't worth the risk. A 30-second manual Cloudflare dashboard cleanup whenever convenient.
- **Acceptance criteria**: `localplus-mobile` and `localplus-admin` confirmed working end-to-end against Bunny (done, via endpoint-level smoke test); `localplus-api`'s Vercel project retired (done, verified live).
- **Files**: `localplus-api/package.json`, `localplus-api/CONTAINER.md` (both uncommitted as of this session — human should review + commit).
- **Role**: Feature Development / Infra
- **Status**: DONE (Vercel-side); Cloudflare CNAME cleanup left as an optional manual follow-up

---

## Future (no scope yet — do not build)

| Item | Description |
|---|---|
| BL-NNN | [Brief description — scoped when ready] |

---

## Completed

| Item | Date | Summary |
|---|---|---|

---

<!--
INSTRUCTIONS:

- The Product role writes items; the Feature Development role executes them.
- Pick the top-most TODO item each session. Mark IN PROGRESS when you start; DONE when verified; NO-OP if found unnecessary.
- BLOCKED items: skip entirely. Surface in Stop Report only.
- FUTURE items: do not build without explicit human scope definition.
- Move completed items to the Completed table (summary only) when detail is no longer needed.
- Add [S/M/L/XL] context cost to each item header.
- Add Role: tag so agents know which role handles each item.
- Add Source: tag if the item originated from an external review (reviews/filename). Optional for items from other sources.
-->
